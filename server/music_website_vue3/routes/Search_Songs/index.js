const express = require('express');
const router = express.Router();
const { connectDB } = require('../../db.js');

async function main(req, context) {
    const { keyword, existSongs = [] } = req.body;
    console.log('搜索关键词:', keyword);
    console.log('需要排除的歌曲ID:', existSongs);

    // 1. 验证关键词
    if (!keyword || keyword.trim() === '') {
        return {
            code: 1,
            msg: "请输入搜索关键词",
            data: [],
            count: 0,
            isNewSongs: false
        };
    }

    const searchKeyword = `%${keyword.trim()}%`;

    try {
        // 2. 构建基础查询
        let baseQuery = `
            SELECT *
            FROM Songs 
            WHERE (title LIKE ? OR artist LIKE ?)
        `;

        let countQuery = `
            SELECT COUNT(*) as total
            FROM Songs 
            WHERE (title LIKE ? OR artist LIKE ?)
        `;

        const baseParams = [searchKeyword, searchKeyword];

        // 3. 添加排除条件（如果 existSongs 有内容）
        if (Array.isArray(existSongs) && existSongs.length > 0) {
            // 过滤有效的 songKey
            const validKeys = existSongs
                .filter(key => key != null && key.toString().trim() !== '')
                .map(key => key.toString().trim());

            console.log('有效的排除ID:', validKeys);

            if (validKeys.length > 0) {
                const placeholders = validKeys.map(() => '?').join(',');
                baseQuery += ` AND songKey NOT IN (${placeholders})`;
                countQuery += ` AND songKey NOT IN (${placeholders})`;
                baseParams.push(...validKeys);
            }
        }

        // 4. 执行搜索查询
        const searchQuery = baseQuery + `
            ORDER BY 
                CASE 
                    WHEN title LIKE ? THEN 1  
                    WHEN title LIKE CONCAT(?, '%') THEN 2  
                    WHEN title LIKE CONCAT('%', ?, '%') THEN 3  
                    WHEN artist LIKE ? THEN 4  
                    WHEN artist LIKE CONCAT(?, '%') THEN 5  
                    WHEN artist LIKE CONCAT('%', ?, '%') THEN 6  
                    ELSE 7
                END,
                title ASC
            LIMIT 20
        `;

        const searchParams = [
            ...baseParams,
            searchKeyword,   // CASE WHEN title LIKE
            keyword.trim(),  // CASE WHEN title LIKE CONCAT(?, '%')
            keyword.trim(),  // CASE WHEN title LIKE CONCAT('%', ?, '%')
            searchKeyword,   // CASE WHEN artist LIKE
            keyword.trim(),  // CASE WHEN artist LIKE CONCAT(?, '%')
            keyword.trim()   // CASE WHEN artist LIKE CONCAT('%', ?, '%')
        ];

        console.log('搜索查询参数:', searchParams);
        const foundSongs = await connectDB(searchQuery, searchParams);

        console.log('搜索到新歌曲数量:', foundSongs.length, foundSongs.map(song => song.songKey));

        var leftCount = 20 - foundSongs.length;

        // 5. 处理搜索结果
        if (leftCount === 0) {
            return {
                code: 0,
                msg: '搜索成功',
                data: foundSongs,
                count: foundSongs.length,
            };
        }

        // 6. 如果没有搜索到新歌曲，返回随机推荐
        console.log('未搜索到20首新歌曲, 剩下的返回随机推荐');
        let randomQuery = `
            SELECT *
            FROM Songs 
        `;

        let randomParams = [];

        // 添加排除条件
        if (Array.isArray(existSongs) && existSongs.length > 0) {
            const validKeys = [...existSongs, ...foundSongs]
                .filter(key => key != null && key.toString().trim() !== '')
                .map(key => key.toString().trim());

            if (validKeys.length > 0) {
                const placeholders = validKeys.map(() => '?').join(',');
                randomQuery += ` WHERE songKey NOT IN (${placeholders})`;
                randomParams.push(...validKeys);
            }
        }

        randomQuery += ` ORDER BY RAND() LIMIT ${leftCount}`;

        const randomSongs = await connectDB(randomQuery, randomParams);

        if (randomSongs.length > 0) {
            console.log('搜索结果', [...foundSongs, ...randomSongs].map(song => song.songKey))
            return {
                code: 0,
                msg: "搜索成功",
                data: [...foundSongs, ...randomSongs],
                count: foundSongs.length + randomSongs.length,
            };
        } else {
            return {
                code: 0,
                msg: `歌曲不到20首`,
                data: foundSongs,
                count: foundSongs.length,
            };
        }

    } catch (error) {
        console.error('搜索过程出错:', error.message);

        // 7. 错误处理 - 尝试返回最简单的数据
        try {
            // 尝试获取一些基本数据（不考虑排除）
            const simpleQuery = `
                SELECT 
                    songKey,
                    title, 
                    artist, 
                    album, 
                    duration
                FROM Songs 
                LIMIT 5
            `;

            const simpleSongs = await connectDB(simpleQuery, []);

            return {
                code: 3,
                msg: `搜索服务遇到问题，返回基础歌曲列表：${error.message}`,
                data: simpleSongs,
                count: simpleSongs.length,
                isNewSongs: simpleSongs.length > 0,
                isFallback: true
            };
        } catch (fallbackError) {
            return {
                code: 500,
                msg: `搜索失败：${error.message}`,
                data: [],
                count: 0,
                isNewSongs: false,
                isFallback: false
            };
        }
    }
}

// 路由定义
router.post('/', async (req, res) => {
    console.log('收到搜索请求:', {
        keyword: req.body.keyword || '空',
        existSongsCount: req.body.existSongs ? req.body.existSongs.length : 0
    });

    try {
        const result = await main(req, {});

        // 根据code设置HTTP状态码
        if (result.code === 500) {
            res.status(500).json(result);
        } else {
            res.json(result);
        }
    } catch (err) {
        console.error('路由处理失败:', err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            data: [],
            count: 0,
            isNewSongs: false
        });
    }
});

module.exports = router;

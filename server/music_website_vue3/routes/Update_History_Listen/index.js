const express = require('express');
const router = express.Router();
const { connectDB } = require('../../db.js');

// 限制最近常听列表的最大长度（防止内存无限增长）
const MAX_HISTORY_LENGTH = 100;

async function main(req, context) {
    const { accountId, song } = req.body;
    console.log('accountId.song', accountId, song)
    // 参数验证
    if (!accountId || !song || !song.title) {
        return {
            code: 400,
            msg: "参数错误: 缺少accountId或song信息"
        };
    }

    try {
        // 1. 查询最近常听歌单
        const result = await connectDB(
            `SELECT songs FROM Playlists WHERE accountId = ? AND name = ?`,
            [accountId, '最近听过']
        );

        if (result.length === 0) {
            return {
                code: 404,
                msg: "最近常听歌单不存在"
            };
        }

        // 2. 解析songs数据（假设存储为JSON字符串）
        let songs = result[0].songs;
        if (typeof songs === 'string') {
            try {
                songs = JSON.parse(songs);
            } catch (parseErr) {
                console.error('解析songs JSON失败:', parseErr);
                songs = [];
            }
        }

        // 确保songs是数组
        if (!Array.isArray(songs)) {
            songs = [];
        }

        // 3. 查找歌曲是否已存在
        const existingIndex = songs.findIndex(item =>
            item.title === song.title
        );

        if (existingIndex !== -1) {
            // 歌曲已存在，移动到开头
            const existingSong = songs[existingIndex];
            songs.splice(existingIndex, 1);  // 移除原位置
            songs.unshift(existingSong);      // 添加到开头
        } else {
            // 歌曲不存在，添加到开头
            songs.unshift(song);

            // 限制列表长度，防止内存无限增长
            if (songs.length > MAX_HISTORY_LENGTH) {
                songs = songs.slice(0, MAX_HISTORY_LENGTH);
            }
        }

        // 4. 更新数据库
        const updateResult = await connectDB(
            `UPDATE Playlists SET songs = ?  WHERE accountId = ? AND name = ?`,
            [JSON.stringify(songs), accountId, '最近常听']
        );

        if (updateResult.affectedRows > 0) {
            return {
                code: 0,
                msg: "更新最近常听歌单成功",
                data: {
                    updatedCount: 1,
                    totalSongs: songs.length
                }
            };
        } else {
            return {
                code: 500,
                msg: "更新最近常听失败，未找到对应记录"
            };
        }

    } catch (err) {
        console.error('更新最近常听失败:', err);

        // 根据错误类型返回不同的错误信息
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return {
                code: 500,
                msg: "数据库表不存在"
            };
        }

        return {
            code: 500,
            msg: "服务器内部错误"
        };
    }
}


// 路由定义
router.post('/', async (req, res) => {
    console.log('收到更新最近常听请求', req.body.accountId, req.body.song?.title);

    try {
        const result = await main(req, {});
        res.json(result);
    } catch (err) {
        console.error('更新最近常听失败:', err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误'
        });
    }
});

module.exports = router;

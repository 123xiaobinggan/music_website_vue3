const express = require('express');
const router = express.Router();
const { connectDB } = require('../../db.js');

async function main(req, context) {
    const { accountId, name, song } = req.body;
    console.log('accountId,name,song ', accountId, name, song);

    let targetPlaylistSongs;

    try {
        const res = await connectDB(
            `SELECT songs FROM Playlists WHERE accountId = ? AND name = ?`,
            [accountId, name]
        );
        if (res.length === 0) {
            return {
                code: 1,
                msg: '此歌单不存在'
            };
        }

        targetPlaylistSongs = res[0].songs

        if (typeof targetPlaylistSongs == "string") {
            try {
                targetPlaylistSongs = JSON.parse(targetPlaylistSongs);
            } catch (err) {
                console.log('解析json失败', err)
                targetPlaylistSongs = [];
            }
        }

        // check if exits
        const existingIndex = targetPlaylistSongs.findIndex(item =>

            (item.title === song.title && (!song.artist || item.artist === song.artist))
        );

        if (existingIndex === -1) {
            return {
                code: 0,
                msg: "歌曲删除成功"
            }
        }

        targetPlaylistSongs.splice(existingIndex,1)

        const updateRes = await connectDB(
            `UPDATE Playlists SET songs = ? WHERE accountId = ? AND name = ?`,
            [JSON.stringify(targetPlaylistSongs), accountId, name]
        );

        if (updateRes.affectedRows > 0) {
            console.log('delete song successfully')
            return {
                code: 0,
                msg: "歌曲删除成功"
            }
        }

    } catch (err) {
        console.log('err', err)
        return {
            code: 1,
            msg: err.message
        }
    }


}


// 路由定义
router.post('/', async (req, res) => {
    console.log('收到删除歌曲到歌单请求');

    try {
        const result = await main(req, {});
        res.json(result);
    } catch (err) {
        console.error('歌曲删除失败:', err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误'
        });
    }
});

module.exports = router;

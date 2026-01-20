const express = require('express');
const router = express.Router();
const { connectDB } = require('../../db.js');

async function main(req, context) {
    const { accountId, playlist } = req.body;
    console.log('accountId,playlist', accountId, playlist);

    try {
        const res = await connectDB(
            `INSERT INTO Playlists (accountId, name, coverUrl, songs)
            VALUES(?, ?, ?, ?) `,
            [
                accountId,
                playlist.name,
                playlist.coverUrl,
                []
            ]
        )

        if (res.affectedRows > 0) {
            console.log('create playlist successfully')
            return {
                code: 0,
                msg: "创建成功"
            }
        } else {
            return {
                code: 1,
                msg: "创建失败"
            }
        }
    } catch (err) {
        return {
            code: 1,
            msg: err.message
        }
    }

}


// 路由定义
router.post('/', async (req, res) => {
    console.log('收到创建歌单请求');

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

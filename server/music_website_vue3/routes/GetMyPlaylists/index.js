const express = require('express');
const router = express.Router();
const { connectDB } = require('../../db.js');

async function main(req, context) {
    const { accountId } = req.body;

    try {
        const res = await connectDB(
            `SELECT name, songs, coverUrl FROM Playlists WHERE accountId = ?`,
            [accountId]
        );
        console.log('res', res)
        if (res.length > 0) {
            console.log('get playlists successfully',res)
            return {
                code: 0,
                msg: "获取歌单成功",
                data: res
            }
        } else {
            return {
                code: 1,
                msg: "获取歌单失败"
            }
        }
    } catch (err) {
        console.error('数据库查询失败:', err);
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return { code: 404, msg: "数据库表不存在" };
        }
        return { code: 500, msg: "服务器内部错误" };
    }

}


// 路由定义
router.post('/', async (req, res) => {
    console.log('收到获取我的歌单请求', req.body.accountId);

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

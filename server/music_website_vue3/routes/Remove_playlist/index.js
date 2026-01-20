const express = require('express');
const router = express.Router();
const { connectDB } = require('../../db.js');

async function main(req, context) {
    const { accountId, name } = req.body;
    console.log('accountId,name', accountId, name);

    try {
        const res = await connectDB(
            `DELETE FROM Playlists WHERE accountId = ? ANd name = ?`,
            [accountId, name]
        );
        if (res.affectedRows > 0) {
            console.log('delete playlist successfully')
            return {
                code: 0,
                msg: "删除成功"
            }
        } else {
            return {
                code: 1,
                msg: "删除失败"
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
    console.log('收到删除歌单请求');

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

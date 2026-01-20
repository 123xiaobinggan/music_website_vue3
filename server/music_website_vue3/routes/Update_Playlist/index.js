const express = require('express')
const router = express.Router()
const { connectDB } = require('../../db.js')

async function main(req, context) {
    const { accountId, newName, coverUrl, name } = req.body;
    console.log('accountId, newName,coverUrl', accountId, newName, coverUrl, name);

    if (!accountId) {
        return {
            code: 1,
            msg: "缺少accountId参数"
        }
    }

    if (!name || name === '') {
        return {
            code: 1,
            msg: "name不可为空"
        }
    }

    if(!newName || newName === ''){
        return {
            code: 1,
            msg: "newName不可为空"
        }
    }

    try {
        const res = await connectDB(
            `UPDATE Playlists SET name = ?, coverUrl= ? WHERE accountId = ? AND name = ?`,
            [newName, coverUrl, accountId, name]
        );
        if (res.affectedRows > 0) {
            return {
                code: 0,
                msg: "更新成功"
            }
        } else {
            const checkRes = await connectDB(
                `SELECT accountId FROM Playlists WHERE accountId = ? AND name = ?`,
                [accountId, name]
            );

            if (checkRes.length === 0) {
                return {
                    code: 2,
                    msg: "指定的歌单不存在"
                }
            } else {
                return {
                    code: 3,
                    msg: "数据无变化或更新失败"
                }
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

router.post('/', async (req, res) => {
    console.log('收到更新Playlist请求', req.body)

    try {
        const result = await main(req, {})
        res.json(result)
    } catch (err) {
        console.error('失败:', err)
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误'
        })
    }
})

module.exports = router

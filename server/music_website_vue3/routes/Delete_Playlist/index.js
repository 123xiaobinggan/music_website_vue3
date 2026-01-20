const express = require('express')
const router = express.Router()
const { connectDB } = require('../../db.js')

async function main(req, context) {
    const { accountId, name } = req.body;
    console.log('accountId,name,', accountId, name);

    // 1. 参数验证
    if (!accountId) {
        return {
            code: 400,
            msg: "缺少必要参数: accountId"
        }
    }

    if (!name || name.trim() === '') {
        return {
            code: 400,
            msg: "歌单名称不能为空"
        }
    }

    if(name === '最近常听' || name === '我喜欢'){
        return {
            code: 1,
            msg: "不可删除"
        }
    }

    const trimmedName = name.trim();

    try {
        // 2. 先检查歌单是否存在（更精确的检查）
        const checkRes = await connectDB(
            `SELECT accountId, name FROM Playlists WHERE accountId = ? AND name = ?`,
            [accountId, trimmedName]
        );

        if (checkRes.length === 0) {
            // 进一步检查是 accountId 不存在还是 name 不匹配
            const accountCheck = await connectDB(
                `SELECT accountId FROM Playlists WHERE accountId = ?`,
                [accountId]
            );

            if (accountCheck.length === 0) {
                return {
                    code: 404,
                    msg: `账户 ${accountId} 不存在或没有歌单`
                }
            } else {
                return {
                    code: 404,
                    msg: `歌单 "${trimmedName}" 不存在`
                }
            }
        }

        // 3. 执行删除
        const deleteRes = await connectDB(
            `DELETE FROM Playlists WHERE accountId = ? AND name = ?`,
            [accountId, trimmedName]
        );

        console.log('删除结果:', { affectedRows: deleteRes.affectedRows });

        if (deleteRes.affectedRows > 0) {
            return {
                code: 0,
                msg: "删除成功",
                data: {
                    accountId,
                    name: trimmedName,
                    deletedAt: new Date().toISOString()
                }
            }
        } else {
            // 理论上不会走到这里，因为前面已经检查过了
            return {
                code: 500,
                msg: "删除失败，请重试"
            }
        }
    } catch (err) {
        console.error('删除歌单失败:', err);

        // 根据错误类型返回不同的消息
        let errorMsg = "删除失败";
        let errorCode = 500;

        if (err.code === 'ER_NO_REFERENCED_ROW') {
            errorMsg = "存在关联数据，无法删除";
            errorCode = 409; // Conflict
        } else if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            errorMsg = "操作超时，请稍后重试";
            errorCode = 408; // Request Timeout
        }

        return {
            code: errorCode,
            msg: errorMsg,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        }
    }


}

router.post('/', async (req, res) => {
    console.log('收到删除Playlist请求', req.body)

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

const express = require('express')
const router = express.Router()
const { connectDB } = require('../../db.js')

async function main(req, context) {
    const { accountId, password } = req.body
    console.log('accountId:', accountId, 'password:', password)

    // 1️⃣ 参数校验
    if (!accountId || !password) {
        return {
            code: 1,
            msg: '账号或密码不能为空'
        }
    }

    // 2️⃣ 查询用户
    const users = await connectDB(
        'SELECT id, accountId, password, username, avatar, vip, listenTime FROM Users WHERE accountId = ?',
        [accountId]
    )

    // 3️⃣ 判断账号是否存在
    if (users.length === 0) {
        return {
            code: 1,
            msg: '账号不存在'
        }
    }

    const user = users[0]

    // 4️⃣ 校验密码（现在是明文，后面我会告诉你怎么升级）
    if (user.password !== password) {
        return {
            code: 1,
            msg: '密码错误'
        }
    }
    console.log('login success', user)

    // 5️⃣ 登录成功（不要返回 password）
    return {
        code: 0,
        msg: '登录成功',
        data: {
            id: user.id,
            accountId: user.accountId,
            username: user.username,
            avatar: user.avatar,
            vip: user.vip,
            listenTime: user.listenTime
        }
    }
}

router.post('/', async (req, res) => {
    console.log('收到登录请求', req.body)

    try {
        const result = await main(req, {})
        res.json(result)
    } catch (err) {
        console.error('登录失败:', err)
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误'
        })
    }
})

module.exports = router

const express = require('express')
const router = express.Router()
const { connectDB } = require('../../db.js')

async function main(req, context) {
    const { accountId, username, password } = req.body
    console.log('accountId:', accountId, 'username:', username, 'password:', password)

    // 1️⃣ 参数校验
    if (!accountId || !username || !password) {
        return {
            code: 1,
            msg: 'accountId、username 或 password 不能为空'
        }
    }

    // 2️⃣ 判断账号是否已存在
    const exists = await connectDB(
        'SELECT id FROM Users WHERE accountId = ?',
        [accountId]
    )

    if (exists.length > 0) {
        return {
            code: 1,
            msg: '账号已存在'
        }
    }

    const user = {
        accountId,
        username,
        avatar: "https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/User/xiaobinggan.jpg",
        vip: 0,
        listenTime: 0,
    }

    // 3️⃣ 插入新用户
    const result = await connectDB(
        `INSERT INTO Users (accountId, username, password, avatar, vip, listenTime)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [
            accountId,
            username,
            password,
            user.avatar,
            user.vip,      // vip 默认 0
            user.listenTime       // listenTime 默认 0
        ]
    )

    const res1 = await connectDB(
        `INSERT INTO Playlists (accountId, name, coverUrl, songs)
        VALUES(?, ?, ?, ?),
              (?, ?, ?, ?)
        `,
        [
            accountId, '最近听过', 'https://picsum.photos/id/' + Math.floor(Math.random() * 1000) + '/200/200', [],
            accountId, '我喜欢', 'https://picsum.photos/id/' + Math.floor(Math.random() * 1000) + '/200/200', []
        ]
    )

    console.log('result res1', result, res1);

    // 4️⃣ 注册成功
    return {
        code: 0,
        msg: '注册成功',
        data: {
            id: result.insertId,
            ...user
        }
    }
}

router.post('/', async (req, res) => {
    console.log('收到注册请求', req.body)

    try {
        const result = await main(req, {})
        res.json(result)
    } catch (err) {
        console.error('注册失败:', err)
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误'
        })
    }
})

module.exports = router

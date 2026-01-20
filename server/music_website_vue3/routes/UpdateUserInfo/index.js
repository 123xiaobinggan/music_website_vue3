const express = require('express')
const router = express.Router()
const { connectDB } = require('../../db.js')

async function main(req, context) {
    const { accountId, username, avatar, password, newPassword } = req.body
    console.log('accountId:', accountId, 'username:', username, 'avatar:', avatar, 'password:', password, 'newPassword:', newPassword)

    const userdb = await connectDB(
        'SELECT id, accountId, username, avatar, password FROM Users WHERE accountId = ?',
        [accountId]
    )

    // 3️⃣ 判断账号是否存在
    if (userdb.length === 0) {
        return {
            code: 1,
            msg: '账号不存在'
        }
    }

    const user = userdb[0]

    if (password) {
        if (password !== user.password) {
            return {
                code: 1,
                msg: '原密码不正确'
            }
        } else {
            user.password = newPassword
        }
    }

    let sql = 'UPDATE Users SET '
    const params = []

    if (username && username !== user.username) {
        sql += 'username = ?'
        params.push(username)
    }

    if (avatar && avatar !== user.avatar) {
        sql += 'avatar = ?'
        params.push(avatar)
    }

    if (newPassword) {
        if (params.length > 0) sql += ', '
        sql += 'password = ?'
        params.push(newPassword)
    }

    // 如果什么都没改
    if (params.length === 0) {
        return {
            code: 0, msg: '更新成功', data: {
                username: username,
                avatar: avatar
            }
        }
    }

    sql += ' WHERE accountId = ?'
    params.push(accountId)

    const res = await connectDB(sql, params)


    if (res.affectedRows > 0) {
        return {
            code: 0,
            msg: '更新成功',
            data: {
                username: username,
                avatar: avatar
            }
        }
    } else {
        return {
            code: 1,
            msg: "更新失败"
        }
    }
}

router.post('/', async (req, res) => {
    console.log('收到更新UserInfo请求', req.body)

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

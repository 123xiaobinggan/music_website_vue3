const express = require('express')
const router = express.Router()
const { connectDB } = require('../../db.js')

async function main(req, context) {
    const { title } = req.body
    if (!title) {
        return {
            code: 1,
            msg: 'title不能为空'
        }
    }
}

router.post('/', async (req, res) => {
    console.log('收到更新GetSongs请求', req.body)

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

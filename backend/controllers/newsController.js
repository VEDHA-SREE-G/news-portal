const db = require('../models')
const News = db.news
const addNews = async(req,res) => {
    let info = {
        title : req.body.title,
        category : req.body.category,
        imageUrl : req.body.imageUrl,
        desc : req.body.desc,
        content : req.body.content,
    }
    const news = await News.create(info)
    res.status(200).send(news)
    console.log(news)
}

const getAllNews = async(req, res) => {
    let id = req.params.id
    let news = await News.findAll()
    res.status(200).send(news)
}

const updateNews = async (req,res) => {
    let id = req.params.id
    const news = await News.update(req.body,{where : {id : id}})
    res.status(200).send(news)
}

const deleteNews = async (req,res) => {
    let id = req.params.id
    await News.destroy({where : {id : id}})
    res.status(200).send("news deleted successfully")
}

const getOneNews = async(req,res) => {
    let id = req.params.id
    let news = await News.findOne({where : {id : id}})
    res.status(200).send(news)
}

module.exports = {
    addNews,
    getAllNews,
    getOneNews,
    deleteNews,
    updateNews
}
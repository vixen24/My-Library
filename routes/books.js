const express = require('express')
const router = express.Router()

const Book = require('../models/book')
const Author = require('../models/author')

const ImageMimeTypes = ['image/jpg', 'image/png', 'image/gif']

//All books route
router.get('/', async (req,res) => {
    let query = Book.find()
    if(req.query.title !== null && req.query.title !== ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore !== null && req.query.publishedBefore !== ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter !== null && req.query.publishedAfter!== ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const book = await query.exec()
        res.render('books/index', {
            book: book,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New book route
router.get('/new', async(req,res) => {
    renderNewPage(res, new Book())
})

//Create book route
router.post('/', async (req,res) => {
    const book = new Book({
        title: req.body.title,
        description:req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        author: req.body.author
    })

    if(req.body.cover !== null && req.body.cover !== '') {
    saveCover(book, req.body.cover)
    } 

    try{
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch{
        renderNewPage(res, book, true)
    }
})
//Show Book by Id
router.get('/:id', async(req, res)=>{
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', {book: book})
    } catch {
        res. redirect('/')
    }
})

//Edit Book
router.get('/:id/edit', async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book, hasError = false)
    } catch {
        res.redirect('/')
    }
})

//Update Book route
router.put('/:id', async (req, res)=> { 
    let book

    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover !== null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if(book !== null){
            renderEditPage(res, book, true)
        } else {
            res.redirect('/')
        }
    }
})
//Delete Book Page
router.delete('/:id', async (req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books') 
    } catch {
        if (book == null) {
            res.redirect('/')
        } else {
            res.render('books/show',{
                book:book,
                errorMessage:'An error occured while deleting this book'
            })
        }
    }
})

function saveCover(book, coverEncoded){
    if(coverEncoded === null) res.redirect('/books')
   //console.log(coverEncoded)
  
    const cover = JSON.parse(coverEncoded)
    if(cover !== null && ImageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

async function renderNewPage(res, book, hasError){
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderEditPage(res, book, hasError){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError){
    try{
       const authors = await Author.find({})
        const params = {
            author: authors,
            book: book
        }
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error updating Book'
            } else {
                params.errorMessage = 'Fill the form below'
            }
        }
        res.render(`books/${form}`, params)
    }catch{
        res.redirect('/books')
    }
}
module.exports = router
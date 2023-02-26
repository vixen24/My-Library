const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//Show all authors
router.get('/', async (req,res) => {
    let searchOptions = {}
    if(req.query.name !== null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i') //Regular expression helps us search for part of text inside a field.
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch{
        res.redirect('/')
    }
})

//New author route
router.get('/new', (req,res) => {
    res.render('authors/new', {author: new Author() })
})

//Create new author
router.post('/', async (req,res) => {
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
 //           throw null;
            //res.redirect('authors/${newAuthor.id}')
            res.redirect('authors') //, {authors: Array.from(author)} 
    } catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', (req, res) => {
    res.send('Show Author' + req.params.id)
})

router.get('/:id/edit', (req, res) {
    res.send('Edit Author' + req.params.id)
})

router.put('/:id', (req, res) => {
    res.send('Update Author' + req.params.id)
})

router.delete('/:id', (req, res) => {
    res.send('Delete Author' + req.params.id)
})


module.exports = router
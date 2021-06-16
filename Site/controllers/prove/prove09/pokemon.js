const Pokemon = require('../../../models/prove09/pokemon');

const ITEMS_PER_PAGE = 10;

exports.getPokemon = async (req, res, next) => {
  const page = + req.query.page || 1; 

  var data = await Pokemon.getPokemon(10*(page-1), ITEMS_PER_PAGE); 

  buildPokemonView(data, req.query.keyword, page, res);
};


buildPokemonView = (data, keyword, page, res) => {
  
  let totalItems = data.count;
  const skip = (page-1) * ITEMS_PER_PAGE;

  res.render('pages/prove/prove09/pr09', {
      title: 'Prove 09',
      path: '/pr09',
      data: data.results,
      keyword: keyword,
      totalItems: totalItems,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1, 
      previousPage: page -1,
      lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
  });
};    



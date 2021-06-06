const https = require('https');

const ITEMS_PER_PAGE = 10;

exports.getSearchProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  
  getList(data => {
      if(req.query.keyword != undefined) {
        data = data.filter(d => d.tags.includes(req.query.keyword));
      }

      let totalItems = data.length;
      const skip = (page-1) * ITEMS_PER_PAGE;
      data = data.slice(skip, skip+ITEMS_PER_PAGE);
      

      res.render('pages/prove/prove08/pr08', {
          title: 'Prove 08',
          path: '/pr08',
          data: data,
          keyword: req.query.keyword,
          totalItems: totalItems,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1, 
          previousPage: page -1,
          lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
  })  
};

exports.postSearchProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  
  getList(data => {
      data = data.filter(d => d.tags.includes(req.body.keyword));
      
      let totalItems = data.length;
      const skip = (page-1) * ITEMS_PER_PAGE;
      
      data = data.slice(skip, skip+ITEMS_PER_PAGE);
      res.render('pages/prove/prove08/pr08', {
          title: 'Prove 08',
          path: '/pr08',
          data: data,
          keyword: req.body.keyword,
          totalItems: totalItems,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1, 
          previousPage: page -1,
          lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
  });    
};



const options = {
  hostname: 'byui-cse.github.io',
  port: 443,
  path: '/cse341-course/lesson03/items.json',
  method: 'GET'
}

getList = (cb) => {
  let jsonResponse = '';
  const dataReq = https.request(options, dataRes => {

      dataRes.on('data', data => {
          jsonResponse = jsonResponse + data;
      });

      dataRes.on('end', () => {
          cb(JSON.parse(jsonResponse))
      });
  });

  dataReq.on('error', error => {
      console.error(error);
  });

  dataReq.end();
}
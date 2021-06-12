const https = require('https');

const ITEMS_PER_PAGE = 10;

exports.getSearchProducts = async (req, res, next) => {
  const page = + req.query.page || 1; 

  var data = await getListAsync(); 
  buildView(data, req.query.keyword, page, res);
};

exports.postSearchProducts = async (req, res, next) => {
  const page = + req.query.page || 1;
  
  var data = await getListAsync(); 
  buildView(data, req.body.keyword, page, res);
};

buildView = (data, keyword, page, res) => {
  if(keyword != undefined && keyword !== "") {
    data = data.filter(d => d.tags.includes(keyword));
  }
  
  let totalItems = data.length;
  const skip = (page-1) * ITEMS_PER_PAGE;
  
  data = data.slice(skip, skip+ITEMS_PER_PAGE);
  res.render('pages/prove/prove08/pr08', {
      title: 'Prove 08',
      path: '/pr08',
      data: data,
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


const options = {
  hostname: 'byui-cse.github.io',
  port: 443,
  path: '/cse341-course/lesson03/items.json',
  method: 'GET'
}

getListAsync = async () => {
  let p = new Promise((resolve, reject)  =>{
    let jsonResponse = '';
    const dataReq = https.request(options, dataRes => {

        dataRes.on('data', data => {
            jsonResponse = jsonResponse + data;
        });

        dataRes.on('end', () => {
            resolve(JSON.parse(jsonResponse));
        });
    });

    dataReq.on('error', error => {
        console.error(error);
        reject(error);
    });

    dataReq.end();
  })

  return await p;
}
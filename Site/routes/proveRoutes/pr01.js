const express = require('express');
const router = express.Router();

const users = ["Tom","Jane","Mary","Jeff"];

const requestHandler = (req, res, next)=> {
  const url = req.url;
  const method = req.method;
  

  if(url === '/'){
    res.write('<html>');
    res.write('<head><title>Users</title><head>');
   
    res.write('<body>');
    res.write('<h1>Welcome to the users page.</h1>');
    res.write('<form action="pr01/create-user" method="POST"><input type="text" name="userName"><button type="submit">Create User</button></form></body>');
    res.write('<a href="pr01/users">Users</a>')
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if(url === '/users'){
    res.write('<html>');
    res.write('<head><title>User List</title><head>');
   
    res.write('<body>');
    res.write('<h1>User listing</h1>');
    res.write('<ul>');
    
    console.log(users);
    for(let i=0;i<users.length; i++){
      res.write('<li>'+users[i]+'</li>');
    }
   
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if(url === '/create-user' && method === 'POST'){
    const body = [];
   
    users.push(req.body.userName);
    return res.redirect(302,'/prove/pr01');

    //console.log(req.body.userName);

    // req.on('data',(chunk)=>{        
    //   body.push(chunk);     
    // });

    
    // return req.on('end', ()=>{      
    //   const parsedBody = Buffer.concat(body).toString();
    //   const message = parsedBody.split('=')[1];
    //   console.log(message);
    //   users.push(message);
      
    //   res.statusCode = 302;
    //   res.setHeader('Location', '/');
      
    //   return res.end();    
    // });
  }

 

  res.setHeader('Content-Type','text/html');
  res.write('<html>');
  res.write('<head><title>Unknown address</title><head>');
  res.write('<body><h1>You have requested an unknown page</h1></body>');
  res.write('</html>');

  res.end();
}

//module.exports = requestHandler;
router.use(requestHandler);


module.exports = router;

const requestHandler = (req, res)=> {
  const url = req.url;
  const method = req.method;

  if(url === '/'){
    res.write('<html>');
    res.write('<head><title>Users</title><head>');
   
    res.write('<body>');
    res.write('<h1>Welcome to the users page.</h1>');
    res.write('<form action="/create-user" method="POST"><input type="text" name="userName"><button type="submit">Create User</button></form></body>');
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
    res.write('<li>Tom</li><li>Jane</li><li>Mary</li><li>Jeff</li>')
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if(url === '/create-user' && method === 'POST'){
    const body = [];

    req.on('data',(chunk)=>{ 
      //console.log(chunk);
      body.push(chunk);
    });

    return req.on('end', ()=>{
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      console.log(message);
      
      res.statusCode = 302;
      res.setHeader('Location', '/');
      
      return res.end();    
    });
  }

  res.setHeader('Content-Type','text/html');
  res.write('<html>');
  res.write('<head><title>Unknown address</title><head>');
  res.write('<body><h1>You have requested an unknown page</h1></body>');
  res.write('</html>');
  res.end();
}

module.exports = requestHandler;


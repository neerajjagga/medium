
function obfuscateEmail(email) {
  const lowercaseEmail = email.toLowerCase();
  const indexOfAtTheRate = lowercaseEmail.indexOf('@');
  const slicedString = lowercaseEmail.slice(1, indexOfAtTheRate - 1); 
  
  let stars = "";
  for (let i = 0; i < slicedString.length; i++) {
    stars += "*"; 
  }
  
  const obfuscatedEmail = lowercaseEmail[0] + stars + lowercaseEmail.slice(indexOfAtTheRate - 1);
  
  return obfuscatedEmail;
}

module.exports = {obfuscateEmail}

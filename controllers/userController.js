const data = {
   users: require('../model/users.json'),
   setUsers: function(data){this.users = data}
}

const getAllUsers = (req, res) =>{
    res.json(data.users)
}

module.exports = {getAllUsers}
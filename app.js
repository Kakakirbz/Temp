const express = require('express');
const upload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

var urlencodedParser = bodyParser.urlencoded({extended:false})
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	pass: "",
	database: "test"
})

app.use(express.static(__dirname + '/public'))
app.use(upload())
app.set('view engine', 'ejs')

app.get('/',function(req,res) {
    res.render('pages/index');
});

app.post('/', urlencodedParser, (req,res) => {
	console.log(req.files);
    if (req.files) {
    	var length = req.files.filename.length;
    	var filename = null;
    	var filetype = null;
    	var file = null;
        console.log(length);
    	if (length > 1) {
    		for (var i = 0; i < length; i++) {
    			file = req.files.filename[i];
    			filename = file.name;
    			filetype = file.mimetype;

    			file.mv('./public/uploads/'+filename, (err) => {
    				if (err) { console.log(err) }
    			})

    			if (filetype == "video/mp4") {
    				insertVideo(filename, filetype);
    			} else {
    				insertFile(filename, filetype);
    			}
    		}
    	} else {
    		file = req.files.filename;
    		filename = file.name;
    		filetype = file.mimetype;

    		file.mv('./public/uploads/'+filename, (err) => {
    			if (err) { console.log(err) }
    		})

    		if (filetype == "video/mp4") {
    			insertVideo(filename, filetype)
    		} else {
    			insertFile(filename, filetype)
    		}
    	}
    } else {
    	console.log('Walay files');
    }

    res.redirect('/');
});

app.listen(4000, () => {
	console.log("Listening to port 4000");
})

function insertFile(filename, filetype) {
	var sql = "INSERT INTO file (file_id, filename, filetype) VALUES (NULL, '"+filename+"', '"+filetype+"')";

	connection.query(sql, (err,result) => {
		if (err) { console.log(err) }
		console.log(result);
	})
}

function insertVideo(filename, filetype) {
	var sql = "INSERT INTO video (video_id, filename, filetype) VALUES (NULL, '"+filename+"', '"+filetype+"')";

	connection.query(sql, (err,result) => {
		if (err) { console.log(err) }
		console.log(result);
	})
}
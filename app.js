const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// 1. DB 연동 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'kimroy',          // 본인의 MySQL 사용자명 입력
    password: 'P@ssw0rd',  // 본인의 MySQL 비밀번호 입력
    database: 'cafe_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL 데이터베이스 연결 성공!');
});

// 2. Express 및 ejs 모듈 사용 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false })); // POST 데이터 파싱용

// [READ] 메인 화면 - 메뉴 목록 보기
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { menus: results });
    });
});

// [CREATE] 메뉴 추가 화면 이동
app.get('/add', (req, res) => {
    res.render('add');
});

// [CREATE] 메뉴 추가 기능 처리
app.post('/add', (req, res) => {
    const { name, price, description } = req.body;
    const sql = 'INSERT INTO menu (name, price, description) VALUES (?, ?, ?)';
    db.query(sql, [name, price, description], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// [UPDATE] 메뉴 수정 화면 이동 (기존 정보 불러오기)
app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM menu WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', { menu: result[0] });
    });
});

// [DELETE] 메뉴 삭제 처리
app.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM menu WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// 서버 실행 (localhost:3000)
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
// import User from './userDetails.js'; 
import jwt from 'jsonwebtoken';
// import Taileu from './userDetails.js';
import { Urlemail, Sendtest, Hoahoc, Dataemail, Toan, NguVan, Ngoaingu, Lichsu, Vatly, Sinhhoc, Dialy, Giaoduckinhtevaphapluat, Tinhoc, Congnghe, Feedback, User, Tailieu, Thongbao, Ip, Course, DanhMucCourse, VideosCourse, Category, Orders, PathCourse, Vocher } from './userDetails.js';
const app = express();
dotenv.config();
import mongoSanitize from "express-mongo-sanitize";
import axios from 'axios'
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// BANK
import crypto from 'crypto';

import PayOS from '@payos/node';
import bodyParser from 'body-parser';





const corsOptions = {
  origin: 'https://onthithpt2026.com',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204



};

app.use(cors(corsOptions));


app.set('trust proxy', true); // Trust first proxy
app.use(express.json());
app.use(express.urlencoded({ extended: true }));












// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});









const JWT_SECRET = "nvanvlasoqq09ffhoecnanckadjvdvadvadffeqefvdb425345yu6iujhgfbfvd";
const mongoUrl = `mongodb+srv://${process.env.MONGO_URI}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));


const PORT = process.env.PORT || 5000;

// Route mặc định
app.get("/", (req, res) => {
  res.json({ message: "API is running v5" });
});







// API đăng ký

app.post("/api/dangki", async (req, res) => {
  const { username, password, email } = req.body;


  const encryptedPassword = await bcrypt.hash(password, 10);  //Mã Hóa mật khẩu



  try {
    const oldUSer = await User.findOne({ email: email });

    if (oldUSer) {
      return res.json({ status: "error", error: "Email Đã Tồn Tại" });
    } else {
      await User.create({
        codeOder: [],
        username,
        password: encryptedPassword,
        email,
        Math: 0,
        sodu: 0,
        literature: 0,
        english: 0,
        physics: 0,
        chemistry: 0,
        biology: 0,
        geography: 0,
        history: 0,
        admin: false,
        checkToan: false,
        checkVan: false,
        checkTienganh: false,
        checkSinh: false,
        checkLy: false,
        checkHoa: false,
        checkSu: false,
        checkDia: false,
        doanhthu: 0,
        danso: 0,
        order: [],
        damua: [],
        hocthu: [],
        vocher: [],
        nguoigioithieu: "",
        nguoimoiduoc: []

      });

      const checkAdmin = await User.findOne({ admin: true });
      if (!checkAdmin) {
        return res.json({ error: "Không Tìm Thấy Tài Khoản Admin" });
      } else {
        await User.updateOne({ email: checkAdmin.email }, { danso: checkAdmin.danso + 1 });
      }
      return res.json({ status: "ok" });



    }

  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
    return res.json({ status: "error" });

  }
});


app.post("/api/dangnhap", async (req, res) => {
  const { emailLOGIN, passwordLOGIN } = req.body;
  const user = await User.findOne({ email: emailLOGIN });
  try {
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {
      const checkPassword = await bcrypt.compare(passwordLOGIN, user.password);
      if (!checkPassword) {
        return res.json({ status: "error", error: "Sai Mật Khẩu" });

      } else {
        const token = jwt.sign(
          {
            email: user.email,
            username: user.username,


          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        if (token) {
          return res.status(200).json({ status: "ok", data: token });
        }
      }
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});

app.post("/api/home", async (req, res) => {
  const { token } = req.body;

  // Kiểm tra xem token có được gửi lên không
  if (!token) {
    return res.status(401).json({ status: "error", error: "Token không được cung cấp" });
  }

  try {
    // Bước 1: Xác thực token.
    // Nếu token không hợp lệ hoặc hết hạn, nó sẽ ném ra một lỗi (throw error).
    const decodedUser = jwt.verify(token, JWT_SECRET);

    // Bước 2: Token hợp lệ, tìm người dùng trong database.
    // Dùng await để code sạch hơn thay vì .then()
    const userFromDb = await User.findOne({ email: decodedUser.email });

    if (!userFromDb) {
      return res.status(404).json({ status: "error", error: "Người dùng không tồn tại" });
    }

    // Bước 3: Gửi dữ liệu người dùng về client
    return res.json({ status: "ok", data: userFromDb });

  } catch (error) {
    // Bước 4: Bắt lỗi từ jwt.verify hoặc từ database
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: "error", error: "Token Đăng Nhập đã hết hạn" });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ status: "error", error: "Token Đăng Nhập không hợp lệ" });
    }

    // Các lỗi khác từ server
    console.error(error); // Ghi lại lỗi để debug
    return res.status(500).json({ status: "error", error: "Lỗi Server" });
  }
});


app.post("/api/changePassword", async (req, res) => {
  const { emailUser, passwordcu, passwordmoi } = req.body;
  const user = await User.findOne({ email: emailUser });
  try {
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {


      const checkPassword = await bcrypt.compare(passwordcu, user.password);

      if (!checkPassword) {
        return res.json({ status: "error", error: "Sai Mật Khẩu" });
      } else {
        const encryptedPassword = await bcrypt.hash(passwordmoi, 10);
        await User.updateOne({ email: emailUser }, { password: encryptedPassword });
        return res.json({ status: "ok" });
      }
    }

  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});


app.post("/api/themtoan", async (req, res) => {
  const { emailUser, SoluongToan } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {
      await User.updateOne({ email: emailUser }, { Math: SoluongToan + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});


app.post("/api/themNguvan", async (req, res) => {
  const { emailUser, SoluongNguvan } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tạii" });
    } else {
      await User.updateOne({ email: emailUser }, { literature: SoluongNguvan + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});



app.post("/api/themTA", async (req, res) => {
  const { emailUser, Soluongtienganh } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tạii" });
    } else {
      await User.updateOne({ email: emailUser }, { english: Soluongtienganh + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});

app.post("/api/hoahoc", async (req, res) => {
  const { emailUser, Soluonghoahoc } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tạii" });
    } else {
      await User.updateOne({ email: emailUser }, { chemistry: Soluonghoahoc + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});


app.post("/api/sinhhoc", async (req, res) => {
  const { emailUser, Soluongsinhhoc } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tạii" });
    } else {
      await User.updateOne({ email: emailUser }, { biology: Soluongsinhhoc + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});

app.post("/api/vatly", async (req, res) => {
  const { emailUser, Soluongvatly } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tạii" });
    } else {
      await User.updateOne({ email: emailUser }, { physics: Soluongvatly + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});

app.post("/api/lichsu", async (req, res) => {
  const { emailUser, Soluonglichsu } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tạii" });
    } else {
      await User.updateOne({ email: emailUser }, { history: Soluonglichsu + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});

app.post("/api/dialy", async (req, res) => {
  const { emailUser, Soluongdialy } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tạii" });
    } else {
      await User.updateOne({ email: emailUser }, { geography: Soluongdialy + 1 });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});





app.post("/api/loginadmin", async (req, res) => {
  const { emailADMIN, passwordADMIN } = req.body;
  const user = await User.findOne({ email: emailADMIN, });
  try {

    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {
      if (!user.admin) {
        return res.json({ status: "error", error: "Bạn Không Có Quyền Đăng Nhập Vào Trang Admin" });
      } else {
        const checkPassword = await bcrypt.compare(passwordADMIN, user.password);
        if (!checkPassword) {
          return res.json({ status: "error", error: "Sai Mật Khẩu" });

        } else {
          const tokenADMIN = jwt.sign(
            {
              email: user.email,
              username: user.username,
              admin: user.admin,
              doanhthu: user.doanhthu,
              danso: user.danso,


            },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
          if (tokenADMIN) {
            return res.status(200).json({ status: "ok", data: tokenADMIN });
          }
        }
      }



    }
  } catch (error) {
    console.log("Kiểm Tra Lại Backend Endpoin", error);
  }
});





app.post("/api/BoardAdmin", async (req, res) => {
  const { tokenADMIN } = req.body;

  try {
    const user = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    if (user == "token expired") {
      return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
    } else {
      const userADMIN = await User.findOne({ email: user.email });
      if (!userADMIN) {
        return res.json({ status: "error", error: "Email Không Tồn Tại" });
      } else {
        if (user.admin === false) {
          return res.json({ status: "error", error: "Bạn Không Có Quyền Đăng Nhập Vào Trang Admin" });
        } else {
          return res.json({ status: "ok", data: user });
        }
      }
    }


  } catch (error) {
    return res.redirect('/');
    return res.json({ status: "error", error: "Lỗi Server" });
  }

});


app.post("/api/xoathanhvien", async (req, res) => {
  const { emailUser } = req.body;

  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {
      await User.deleteOne({ email: emailUser });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    return res.json({ status: "error", error: "Lỗi Server" });
  }

});


app.post("/api/capnhatsodu", async (req, res) => {
  const { emailUser, SoduCapnhat } = req.body;

  try {

    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {
      await User.updateOne({ email: emailUser }, { sodu: SoduCapnhat });
      return res.json({ status: "ok" });
    }
  } catch (error) {
    return res.json({ status: "error", error: "Lỗi Server" });
  }
});


app.post("/api/capnhatpasssinhvien", async (req, res) => {
  const { emailUser, passwordCapnhat } = req.body;
  const { tokenADMIN } = req.body;
  try {
    const user = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });

    if (user == "token expired") {
      return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
    } else {
      const checkUser = await User.findOne({ email: emailUser });
      if (!checkUser) {
        return res.json({ status: "error", error: "Email Không Tồn Tại" });
      } else {
        const encryptedPassword = await bcrypt.hash(passwordCapnhat, 10);
        await User.updateOne({ email: emailUser }, { password: encryptedPassword });
        return res.json({ status: "ok" });
      }
    }
  } catch (error) {
    return res.json({ status: "error", error: "Lỗi Server" });
  }
});



app.post("/api/kichhoatkhoahoc", async (req, res) => {
  const { emailUser, toan, van, tienganh, sinh, ly, hoa, su, dia } = req.body;
  try {
    const user = await User.findOne({ email: emailUser });
    if (!user) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {
      if (!user.checkToan) {
        await User.updateOne({ email: emailUser }, { checkToan: toan });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkToan) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }

      }
      if (!user.checkVan) {
        await User.updateOne({ email: emailUser }, { checkVan: van });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkVan) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }
      }
      if (!user.checkTienganh) {
        await User.updateOne({ email: emailUser }, { checkTienganh: tienganh });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkTienganh) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }
      }
      if (!user.checkSinh) {
        await User.updateOne({ email: emailUser }, { checkSinh: sinh });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkSinh) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }
      }
      if (!user.checkLy) {
        await User.updateOne({ email: emailUser }, { checkLy: ly });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkLy) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }
      }
      if (!user.checkHoa) {
        await User.updateOne({ email: emailUser }, { checkHoa: hoa });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkHoa) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }
      }
      if (!user.checkSu) {
        await User.updateOne({ email: emailUser }, { checkSu: su });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkSu) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }
      }
      if (!user.checkDia) {
        await User.updateOne({ email: emailUser }, { checkDia: dia });
        const UpdateUser = await User.findOne({ email: emailUser });
        if (UpdateUser.checkDia) {
          const checkAdmin = await User.findOne({ admin: true });
          if (!checkAdmin) {
            return res.json({ error: "Không Có Admin" });
          } else {
            await User.updateOne({ email: checkAdmin.email }, { doanhthu: checkAdmin.doanhthu + 199000 });
          }
        }
      }
      return res.json({ status: "ok" });
    }
  } catch (error) {
    return res.json({ status: "error", error: "Lỗi Server" });
  }
});

app.post("/api/changepasswordAdmin", async (req, res) => {
  const { tokenADMIN, passwordCapnhat, Mabimat } = req.body;
  const user = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (err) {
      return "token expired";
    }
    return res;
  });
  if (user == "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    if (Mabimat == "562006") {
      const encryptedPassword = await bcrypt.hash(passwordCapnhat, 10);
      await User.updateOne({ email: user.email }, { password: encryptedPassword });
      return res.json({ status: "ok" });
    } else {
      return res.json({ status: "error", error: "Mã bí mật không đúng" });
    }
  }

});

app.post("/api/kiemtrathongtinhocsinh", async (req, res) => {
  const { tokenADMIN, emailUser } = req.body;
  const user = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (err) {
      return "token expired";
    }
    return res;
  });
  if (user == "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    const checkUser = await User.findOne({ email: emailUser });
    if (!checkUser) {
      return res.json({ status: "error", error: "Email Không Tồn Tại" });
    } else {
      return res.json({ status: "ok", data: checkUser });
    }
  }
});


app.post("/api/themtailieu", async (req, res) => {
  const { tokenAMDMIN, title, linkimg, linkdownloadfn } = req.body;
  const admin = jwt.verify(tokenAMDMIN, JWT_SECRET, (err, res) => {
    if (!tokenAMDMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin == "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Tailieu.create({
      title: title,
      linkimg: linkimg,
      linkdownload: linkdownloadfn,
    });
    return res.json({ status: "ok" });
  }
});

app.post("/api/laytailieu", async (req, res) => {
  const token = req.body;
  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (user == "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    const listTailieu = await Tailieu.find();
    return res.json({ status: "ok", data: listTailieu });
  }

})

app.post("/api/xoatailieu", async (req, res) => {
  console.log("Đã gửi request thành công 1")
  try {
    const { tokenADMIN, checktitlexoa } = req.body;
    const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
      if (!tokenADMIN) {
        return "token expired";
      } else {
        return res;
      }
    });
    if (admin === "token expired") {
      console.log("Token bị lỗi")
      return "token expired";
    }

    await Thongbao.updateOne({ id: 562006 }, { text: checktitlexoa });
    return res.json({ status: "ok" });



  } catch (error) {

    console.log("Lỗi chính: ", error)
    return res.json({ status: "error", message: error })
  }

});


app.post("/api/themkhoahoc", async (req, res) => {
  const { tokenADMIN, idCategory, contentCoursekth, idtkh, titletkh, introduceCoursetkh, pricetkh, imgCoursetkh, priceSaletkh, authortkh, introduceAuthortkh, luotmua } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });

  if (admin == "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Course.create({
      id: idtkh,
      title: titletkh,
      introduceCourse: introduceCoursetkh,
      price: pricetkh,
      ContentCourse: contentCoursekth,
      imgCourse: imgCoursetkh,
      author: authortkh,
      introduceAuthor: introduceAuthortkh,
      DanhMucCourse: [],
      priceSale: priceSaletkh,
      luotmua: luotmua,
      idCate: idCategory,

    });

    await Category.updateOne(
      { idCate: idCategory },
      {
        $push: {
          listCate: {
            id: idtkh,
            title: titletkh,
            introduceCourse: introduceCoursetkh,
            price: pricetkh,
            ContentCourse: contentCoursekth,
            imgCourse: imgCoursetkh,
            author: authortkh,
            luotmua: luotmua,
            introduceAuthor: introduceAuthortkh,
            priceSale: priceSaletkh,
          }
        }
      }
    );


    await PathCourse.create({
      idPath: idtkh,
    });
    return res.json({ status: "ok" });
  }

});

app.post("/api/ADDDanhMucCourse", async (req, res) => {
  const { tokenADMIN, titledm, idCoursedm, idDanhMucdm } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin === "token expired") {
    res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Course.updateOne(
      { id: idCoursedm },
      {
        $push: {
          DanhMucCourse: {
            idDanhMuc: idDanhMucdm,
            title: titledm,
            Videos: [],
          }
        }
      }
    );
    return res.json({ status: "ok" });
  }
});

// app.post("/api/themvideo", async( req, res ) =>{
//   const {tokenADMIN, idDanhMuctvd, linkvideotvd, titletvd, idvideotvd} = req.body;
//   const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
//     if(!tokenADMIN) {
//       return "token expired";
//     } else {
//       return  res;
//     }
//   });
//   if(admin === "token expired") { 
//     res.json({status: "error", error: "Token đã hết hạn hoặc không có"});
//   } else { 
//     await Course.updateOne(
//       { 
//         "DanhMucCourse.idDanhMuc": idDanhMuctvd,
//       },
//       { 
//         $push: { 
//           "DanhMucCourse.$.Videos":{ 
//             linkVideo: linkvideotvd,
//             title: titletvd,
//             idVideo: idvideotvd,
//           }
//         }
//       }
//     )
//     return res.json({status: "ok"});
//   }
// } );

app.post("/api/xoabaihoc", async (req, res) => {
  const { tokenADMIN, idCourse, idDanhMuc, idvideo } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin === "token expired") {
    res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Course.updateOne(
      {
        "DanhMucCourse.idDanhMuc": idDanhMuc,
      },
      {
        $pull: {
          "DanhMucCourse.$.Videos": {

            idVideo: idvideo,
          }
        }
      }
    )
    return res.json({ status: "ok" });
  }
});

app.post("/api/xoadanhmuc", async (req, res) => {
  const { tokenADMIN, idCourse, idDanhMuc } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Course.updateOne(
      { id: idCourse }, // hoặc điều kiện xác định document cần cập nhật
      {
        $pull: { DanhMucCourse: { idDanhMuc: idDanhMuc } }
      }
    );
    return res.json({ status: "ok" });
  }
});

app.post("/api/xoaKhoaHoc", async (req, res) => {
  const { tokenADMIN, idCourse } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {

      return res;
    }
  });
  if (admin === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Course.deleteOne({ id: idCourse });
    return res.json({ status: "ok" });
  }
});

app.post("/api/hienthikhoahoc", async (req, res) => {
  const { tokenADMIN } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    const khoahocadmin = await Course.find();
    return res.json({ status: "ok", Course: khoahocadmin });
  }
});

app.post("/api/xoacoursevalue", async (req, res) => {
  const { tokenADMIN, idCourse } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Course.deleteOne({ id: idCourse });
    return res.json({ status: "ok" });
  }
});


app.post("/api/Createcategory", async (req, res) => {
  const { tokenADMIN, idCategory, titleCategory, img } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Category.create({
      idCate: idCategory,
      titleCate: titleCategory,
      listCate: [],
      img: img,
    });
    return res.json({ status: "ok" });
  }
});








// Configure PayOS client
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY,

);

// Raw body parser only for webhook route to verify signature on unmodified payload
app.post(
  '/api/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Extend per-route timeout (30s)
    req.setTimeout(30 * 1000);
    next();
  }
);

// Signature verification function
function verifySignature(data, receivedSignature) {
  try {
    const sorted = Object.keys(data)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
    const query = Object.entries(sorted)
      .map(([k, v]) => `${k}=${v ?? ''}`)
      .join('&');
    const hmac = crypto.createHmac('sha256', process.env.PAYOS_CHECKSUM_KEY);
    hmac.update(query);
    return hmac.digest('hex') === receivedSignature;
  } catch (e) {
    console.error('Signature verify error:', e);
    return false;
  }
}

// Webhook handler
app.post('/api/webhook', async (req, res) => {
  try {
    // Parse JSON from raw buffer
    const payload = req.body;

    // Validate payload structure
    if (!payload.data || !payload.signature) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Verify signature
    if (!verifySignature(payload.data, payload.signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Immediate acknowledgment to avoid timeout
    res.status(200).json({ code: '00', desc: 'success' });

    // Asynchronous business logic
    process.nextTick(async () => {
      try {
        const event = payload.data;



        if (payload.success) {
          // TODO: save to DB, send notification, etc.
          // console.log('Payment succeeded:', event.orderCode);

          const order = await Orders.findOne({ orderCode: event.orderCode });
          if (order) {

            await User.updateOne({ email: order.email }, { sodu: order.sodu + event.amount });
            await Orders.updateOne({ orderCode: event.orderCode }, { status: "success" });




            return res.json({ status: "ok" });
          }
        } else {

          console.log('Payment cancelled:', event.orderCode);
        }
      } catch (bizErr) {

        console.error('Async processing error:', bizErr);
      }
    });

  } catch (err) {
    console.error('Webhook handler error:', err);
    // Fallback error response
    return res.status(500).json({ code: '99', desc: 'Internal Server Error' });
  }
});

// Create payment link endpoint unchanged
app.post('/api/create-payment', express.json(), async (req, res) => {
  try {
    const { amount, description, emailUser } = req.body;


    const paymentData = {
      orderCode: Date.now(),
      amount: Number(amount),
      description: description || 'Default payment',
      cancelUrl: `${process.env.BASE_URL}/home`,
      returnUrl: `${process.env.BASE_URL}/home`
    };
    const link = await payos.createPaymentLink(paymentData);
    const soduUser = await User.findOne({ email: emailUser });
    await Orders.create({
      sodu: soduUser.sodu,
      email: emailUser,
      orderCode: paymentData.orderCode,
      amount: amount,
      description: description,
      status: "await",
      time: new Date().toLocaleString()

    });


    return res.json({ status: "ok", link: link.checkoutUrl });
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/lichsugd', async (req, res) => {
  const { token, email } = req.body;

  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (user === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    console.log(email);

    const orders = await Orders.find({ email: email });
    console.log(orders);
    if (orders) {
      return res.json({ status: "ok", data: orders });
    } else {
      return res.json({ status: "error", error: "Không tìm thấy đơn hàng" });
    }
  }
});



app.post("/api/rendercate", async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }

  });

  if (user === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    const listcate = await Category.find();
    return res.json({ status: "ok", data: listcate });
  }
});


app.post("/api/pathcourse", async (req, res) => {
  try {
    const path = await Course.find();
    return res.json({ status: "ok", data: path });
  } catch (error) {
    console.error("Error fetching path courses:", error);
    return res.json({ status: "error", Lỗi: error });
  }
});

app.post("/api/pathcourseNew", async (req, res) => {
  const { soluong } = req.body;
  try {
    const path = await Course.find();
    console.log("Số lượng hiện tại: ", soluong)
    console.log("Số lượng hệ thông:", path.length())
    return res.json({ status: "ok", data: path });
  } catch (error) {
    console.error("Error fetching path courses:", error);
    return res.json({ status: "error", Lỗi: error });
  }
});


app.post("/api/rendercourse", async (req, res) => {
  const { token, id } = req.body;
  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (token === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    const course = await Category.findOne({ idCate: id });
    return res.json({ status: "ok", data: course });
  }

});

app.post("/api/paycourse", async (req, res) => {
  const { token, id, email, vocher, folderName, role = 'reader', parentFolderId } = req.body;
  console.log(folderName);

  if (vocher != "") {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (!token) {
        return "token expired";
      } else {
        return res;
      }
    });
    if (user === "token expired") {
      return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
    } else {
      const course = await Course.findOne({ id: id });
      const userpay = await User.findOne({ email: email });
      const check = await User.findOne({ email: email, vocher: { $in: [vocher] } });
      const sale = await Vocher.findOne({ CodeVocher: vocher });
      if (check) {
        return res.json({ status: "error", error: "Bạn Đã Sử Dụng Vocher Này !" });
      } else {
        if (userpay.sodu < course.price) {
          return res.json({ status: "error", error: "Số dư không đủ bạn đang dùng vocher" });
        } else {
          const tg = ((course.price * (100 - sale.priceVocher)) / 100)

          console.log(userpay.sodu);

          await User.updateOne({ email: email }, { sodu: userpay.sodu - tg });
          await User.updateOne({ email: email }, { vocher: [...userpay.vocher, vocher] });
          await User.updateOne({ email: email }, { damua: [...userpay.damua, course.id] });
          try {
            // ================= TẢI VÀ VALIDATE CREDENTIALS =================

            const { data } = await axios.get(CREDENTIALS_URL, {
              transformResponse: [],
              responseType: 'json'
            });

            const credentials = JSON.parse(data);
            if (!credentials.client_email?.endsWith('.gserviceaccount.com')) {
              throw new Error('Email service account không hợp lệ');
            }

            const auth = new google.auth.JWT({
              email: credentials.client_email,
              key: credentials.private_key.replace(/\\n/g, '\n'),
              scopes: DRIVE_SCOPES
            });

            // ================= KHỞI TẠO DRIVE CLIENT =================
            const drive = google.drive({
              version: 'v3',
              auth,
              params: { supportsAllDrives: true }
            });

            // ================= XỬ LÝ REQUEST =================



            // Validate input
            if (!folderName || !email) {
              return res.status(400).json({
                success: false,
                error: 'Thiếu tham số bắt buộc',
                requiredFields: ['folderName', 'email']
              });
            }

            // ================= TÌM FOLDER NÂNG CAO =================
            const escapedName = folderName.replace(/'/g, "\\'");
            let query = [
              `name = '${escapedName}'`,
              "mimeType = 'application/vnd.google-apps.folder'",
              parentFolderId ? `'${parentFolderId}' in parents` : null,
              "trashed = false"
            ].filter(Boolean).join(' and ');

            console.log('🔍 Search query:', query);

            const { data: searchResult } = await drive.files.list({
              q: query,
              fields: 'files(id, name, parents)',
              spaces: 'drive',
              includeItemsFromAllDrives: true,
              supportsAllDrives: true
            });

            if (!searchResult.files?.length) {
              return res.status(404).json({
                success: false,
                error: `Không tìm thấy folder "${folderName}"`,
                troubleshooting: [
                  'Kiểm tra chính tả tên folder',
                  'Đảm bảo folder được chia sẻ với Service Account',
                  `Email service account: ${credentials.client_email}`
                ]
              });
            }

            if (searchResult.files.length > 1) {
              return res.status(409).json({
                success: false,
                error: `Tìm thấy ${searchResult.files.length} folder trùng tên`,
                folders: searchResult.files.map(f => ({
                  id: f.id,
                  name: f.name,
                  parent: f.parents?.[0]
                }))
              });
            }

            // ================= CHIA SẺ FOLDER =================
            const folder = searchResult.files[0];
            const { data: permission } = await drive.permissions.create({
              fileId: folder.id,
              supportsAllDrives: true,
              sendNotificationEmail: true,
              requestBody: {
                role: role === 'viewer' ? 'reader' : role, // Google Drive API dùng 'reader' thay vì 'viewer'
                type: 'user',
                emailAddress: email
              }
            });

            // ================= TRẢ KẾT QUẢ =================
            return res.json({
              success: true,
              status: "ok",
              success: "Bạn đã mua khóa học thành công, Hãy Vào Phần Quản Lý Khóa Học Để Xem",
              message: `Đã chia sẻ folder thành công tới ${email}`,
              folder: {
                id: folder.id,
                name: folder.name,
                url: `https://drive.google.com/drive/folders/${folder.id}`
              },
              permission: {
                id: permission.id,
                role: permission.role,
                expirationTime: permission.expirationTime
              }
            });

          } catch (error) {
            console.error('🔥 Lỗi nghiêm trọng:', error.stack);
            const statusCode = error.response?.status || 500;
            return res.status(statusCode).json({
              success: false,
              error: error.message,
              details: {
                code: error.code,
                response: error.response?.data,
                config: error.config?.url
              }
            });
          }

        }
      }


    }
  } else {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (!token) {
        return "token expired";
      } else {
        return res;
      }
    });

    if (user === "token expired") {
      return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
    } else {
      const course = await Course.findOne({ id: id });
      const userpay = await User.findOne({ email: email });
      const check = await User.findOne({ email: email, damua: { $in: [course.id] } });
      if (check) {
        return res.json({ status: "error", error: "Bạn đã mua khóa học này" });
      } else {
        if (userpay.sodu < course.price) {
          return res.json({ status: "error", error: "Số dư không đủ Và Bạn Không Dùng Vocher" });
        } else {
          const amountpay = course.price;
          await User.updateOne({ email: email }, { sodu: userpay.sodu - amountpay });
          await User.updateOne({ email: email }, { damua: [...userpay.damua, course.id] });
          try {
            // ================= TẢI VÀ VALIDATE CREDENTIALS =================

            const { data } = await axios.get(CREDENTIALS_URL, {
              transformResponse: [],
              responseType: 'json'
            });

            const credentials = JSON.parse(data);
            if (!credentials.client_email?.endsWith('.gserviceaccount.com')) {
              throw new Error('Email service account không hợp lệ');
            }

            const auth = new google.auth.JWT({
              email: credentials.client_email,
              key: credentials.private_key.replace(/\\n/g, '\n'),
              scopes: DRIVE_SCOPES
            });

            // ================= KHỞI TẠO DRIVE CLIENT =================
            const drive = google.drive({
              version: 'v3',
              auth,
              params: { supportsAllDrives: true }
            });

            // ================= XỬ LÝ REQUEST =================



            // Validate input
            if (!folderName || !email) {
              return res.status(400).json({
                success: false,
                error: 'Thiếu tham số bắt buộc',
                requiredFields: ['folderName', 'email']
              });
            }

            // ================= TÌM FOLDER NÂNG CAO =================
            const escapedName = folderName.replace(/'/g, "\\'");
            let query = [
              `name = '${escapedName}'`,
              "mimeType = 'application/vnd.google-apps.folder'",
              parentFolderId ? `'${parentFolderId}' in parents` : null,
              "trashed = false"
            ].filter(Boolean).join(' and ');



            const { data: searchResult } = await drive.files.list({
              q: query,
              fields: 'files(id, name, parents)',
              spaces: 'drive',
              includeItemsFromAllDrives: true,
              supportsAllDrives: true
            });

            if (!searchResult.files?.length) {
              return res.status(404).json({
                success: false,
                error: `Không tìm thấy folder "${folderName}"`,
                troubleshooting: [
                  'Kiểm tra chính tả tên folder',
                  'Đảm bảo folder được chia sẻ với Service Account',
                  `Email service account: ${credentials.client_email}`
                ]
              });
            }

            if (searchResult.files.length > 1) {
              return res.status(409).json({
                success: false,
                error: `Tìm thấy ${searchResult.files.length} folder trùng tên`,
                folders: searchResult.files.map(f => ({
                  id: f.id,
                  name: f.name,
                  parent: f.parents?.[0]
                }))
              });
            }

            // ================= CHIA SẺ FOLDER =================
            const folder = searchResult.files[0];
            const { data: permission } = await drive.permissions.create({
              fileId: folder.id,
              supportsAllDrives: true,
              sendNotificationEmail: true,
              requestBody: {
                role: role === 'viewer' ? 'reader' : role, // Google Drive API dùng 'reader' thay vì 'viewer'
                type: 'user',
                emailAddress: email
              }
            });

            // ================= TRẢ KẾT QUẢ =================
            return res.json({
              success: true,
              status: "ok",
              success: "Bạn đã mua khóa học thành công, Hãy Vào Phần Quản Lý Khóa Học Để Xem",
              message: `Đã chia sẻ folder thành công tới ${email}`,
              folder: {
                id: folder.id,
                name: folder.name,
                url: `https://drive.google.com/drive/folders/${folder.id}`
              },
              permission: {
                id: permission.id,
                role: permission.role,
                expirationTime: permission.expirationTime
              }
            });

          } catch (error) {

            const statusCode = error.response?.status || 500;
            return res.status(statusCode).json({
              success: false,
              error: error.message,
              details: {
                code: error.code,
                response: error.response?.data,
                config: error.config?.url
              }
            });
          }

        }

      }
    }

  }

});

app.post("/api/creatvocher", async (req, res) => {
  const { tokenADMIN, idVocher, CodeVocher, priceVocher } = req.body;
  const user = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (user === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    await Vocher.create({ idVocher: idVocher, CodeVocher: CodeVocher, priceVocher: priceVocher });
    return res.json({ status: "ok", success: "Tạo Vocher Thành Công" });
  }
});

app.post("/api/hocthu", async (req, res) => {
  const { token, id } = req.body;
  console.log(id);
  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }

  });
  if (user === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {

    const userhocthu = await User.findOne({ email: user.email });
    // await User.updateOne({email: user.email}, {hocthu: [...userhocthu.hocthu, id]});
    await User.updateOne(
      { email: user.email },
      {
        $push: {
          hocthu: {
            id: id,

          }
        }
      }
    )
    return res.json({ status: "ok", success: "Bạn Đã Thêm Khóa Học Này Vào Danh Sách Học Thử Thành Công" });
  }
});


app.post("/api/coursephobien", async (req, res) => {
  const { id, token } = req.body;
  console.log(id);
  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (user === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" })
  } else {
    const category = await Category.findOne({ idCate: id });

    return res.json({ status: "ok", data: category });
  }
});



app.post("/api/renderhocthu", async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (user === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    const datacourse = [];
    const userhocthu = await User.findOne({ email: user.email });
    console.log(userhocthu);
    if (userhocthu.hocthu.length > 0) {
      for (let i = 0; i < userhocthu.hocthu.length; i++) {
        const course = await Course.findOne({ id: userhocthu.hocthu[i].id });
        datacourse.push(course);
      }
      return res.json({ status: "ok", data: datacourse, soluong: userhocthu.hocthu.length });

    } else {
      return res.json({ status: "error", error: "Bạn Không Có Khóa Học Nào" });
    }


  }

});

app.post("/api/renderhocreal", async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
    if (!token) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (user === "token expired") {
    return res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {
    const DataCourse = [];
    const userreal = await User.findOne({ email: user.email });
    if (userreal.damua.length > 0) {
      for (let i = 0; i < userreal.damua.length; i++) {
        const course = await Course.findOne({ id: userreal.damua[i] });
        DataCourse.push(course);
      }
      return res.json({ status: "ok", data: DataCourse, soluong: userreal.damua.length });
    }

  }

})



//  =================== API GOOGLE DRIVE ===================


// ================= CẤU HÌNH HẰNG SỐ =================
const CREDENTIALS_URL = 'https://drive.google.com/uc?export=download&id=19CUNDEu_t7InHUG3lMIK86Ka1ntZybki';
const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];

// ================= XỬ LÝ LỖI TOÀN CỤC =================
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// ================= API ENDPOINT =================
app.post('/api/share-folder', async (req, res) => {
  try {
    // ================= TẢI VÀ VALIDATE CREDENTIALS =================
    console.log('🔄 Đang tải credentials từ:', CREDENTIALS_URL);
    const { data } = await axios.get(CREDENTIALS_URL, {
      transformResponse: [],
      responseType: 'json'
    });

    const credentials = JSON.parse(data);
    if (!credentials.client_email?.endsWith('.gserviceaccount.com')) {
      throw new Error('Email service account không hợp lệ');
    }

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, '\n'),
      scopes: DRIVE_SCOPES
    });

    // ================= KHỞI TẠO DRIVE CLIENT =================
    const drive = google.drive({
      version: 'v3',
      auth,
      params: { supportsAllDrives: true }
    });

    // ================= XỬ LÝ REQUEST =================
    const { folderName, email, role = 'reader', parentFolderId } = req.body;

    // Validate input
    if (!folderName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu tham số bắt buộc',
        requiredFields: ['folderName', 'email']
      });
    }

    // ================= TÌM FOLDER NÂNG CAO =================
    const escapedName = folderName.replace(/'/g, "\\'");
    let query = [
      `name = '${escapedName}'`,
      "mimeType = 'application/vnd.google-apps.folder'",
      parentFolderId ? `'${parentFolderId}' in parents` : null,
      "trashed = false"
    ].filter(Boolean).join(' and ');

    console.log('🔍 Search query:', query);

    const { data: searchResult } = await drive.files.list({
      q: query,
      fields: 'files(id, name, parents)',
      spaces: 'drive',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true
    });

    if (!searchResult.files?.length) {
      return res.status(404).json({
        success: false,
        error: `Không tìm thấy folder "${folderName}"`,
        troubleshooting: [
          'Kiểm tra chính tả tên folder',
          'Đảm bảo folder được chia sẻ với Service Account',
          `Email service account: ${credentials.client_email}`
        ]
      });
    }

    if (searchResult.files.length > 1) {
      return res.status(409).json({
        success: false,
        error: `Tìm thấy ${searchResult.files.length} folder trùng tên`,
        folders: searchResult.files.map(f => ({
          id: f.id,
          name: f.name,
          parent: f.parents?.[0]
        }))
      });
    }

    // ================= CHIA SẺ FOLDER =================
    const folder = searchResult.files[0];
    const { data: permission } = await drive.permissions.create({
      fileId: folder.id,
      supportsAllDrives: true,
      sendNotificationEmail: true,
      requestBody: {
        role: role === 'viewer' ? 'reader' : role, // Google Drive API dùng 'reader' thay vì 'viewer'
        type: 'user',
        emailAddress: email
      }
    });

    // ================= TRẢ KẾT QUẢ =================
    res.json({
      success: true,
      message: `Đã chia sẻ folder thành công tới ${email}`,
      folder: {
        id: folder.id,
        name: folder.name,
        url: `https://drive.google.com/drive/folders/${folder.id}`
      },
      permission: {
        id: permission.id,
        role: permission.role,
        expirationTime: permission.expirationTime
      }
    });

  } catch (error) {
    console.error('🔥 Lỗi nghiêm trọng:', error.stack);
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
      details: {
        code: error.code,
        response: error.response?.data,
        config: error.config?.url
      }
    });
  }
});

app.post("/api/feedback", async (req, res) => {
  const feedbacks = await Feedback.find();
  res.json({
    success: true,
    feedback: feedbacks
  })
});
app.post("/api/feedbackadd", async (req, res) => {
  const { name, img, content } = req.body;
  const feedback = new Feedback({
    name,
    img,
    content,
  });
  await feedback.save();

  return res.json({
    success: true,
    feedback
  });
});




function extractFolderId(url) {
  const regex = /\/folders\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


app.post("/api/themvideo", async (req, res) => {
  const { tokenADMIN, idDanhMuctvd, folderLink } = req.body;
  const admin = jwt.verify(tokenADMIN, JWT_SECRET, (err, res) => {
    if (!tokenADMIN) {
      return "token expired";
    } else {
      return res;
    }
  });
  if (admin === "token expired") {
    res.json({ status: "error", error: "Token đã hết hạn hoặc không có" });
  } else {

    // TRÍCH XUẤT DANH JSON VIDEO 

    try {
      // ================= XÁC THỰC =================
      const { data } = await axios.get(CREDENTIALS_URL, {
        transformResponse: [],
        responseType: 'json'
      });

      const credentials = JSON.parse(data);
      if (!credentials.client_email?.endsWith('.gserviceaccount.com')) {
        throw new Error('Email service account không hợp lệ');
      }

      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key.replace(/\\n/g, '\n'),
        scopes: DRIVE_SCOPES
      });

      // ================= KHỞI TẠO DRIVE CLIENT =================
      const drive = google.drive({
        version: 'v3',
        auth,
        params: { supportsAllDrives: true }
      });

      // ================= XỬ LÝ INPUT =================


      if (!folderLink) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu tham số folderLink'
        });
      }

      const folderId = extractFolderId(folderLink);
      if (!folderId) {
        return res.status(400).json({
          success: false,
          error: 'Định dạng link folder không hợp lệ'
        });
      }

      // ================= TRUY VẤN VIDEO =================
      const { data: fileList } = await drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'video/' and trashed = false`,
        fields: 'files(id, name, mimeType)',
        pageSize: 1000,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true
      });

      // ================= XỬ LÝ KẾT QUẢ =================
      const videos = fileList.files.map(file => ({
        name: file.name,
        driveLink: `https://drive.google.com/file/d/${file.id}/view`,
        mimeType: file.mimeType
      }));



      //LOGIC THÊM VIDEO TỪ JSON 
      let idvideodrive = videos.length;
      for (const video of videos) {

        const cleanedName = video.name.replace(/Copy of|Bản sao của/g, "").trim();



        try {
          await Course.updateOne(
            {
              "DanhMucCourse.idDanhMuc": idDanhMuctvd,
            },
            {
              $push: {
                "DanhMucCourse.$.Videos": {
                  linkVideo: video.driveLink,
                  title: cleanedName,
                  idVideo: `${idDanhMuctvd}${idvideodrive}`,
                }
              }
            }
          );
          idvideodrive -= 1;
        } catch (error) {
          console.error(`Lỗi khi cập nhật video ${video.name}:`, error);
          return res.status(500).json({
            status: "error",
            error: "Không thể cập nhật video vào database"
          });
        }
      }

      return res.json({
        status: "ok",
        addedCount: videos.length,
        folderId: folderId
      });

    } catch (error) {
      console.error('🔥 Lỗi:', error);
      const statusCode = error.response?.status || 500;
      return res.status(statusCode).json({
        success: false,
        error: error.message,
        details: {
          code: error.code,
          response: error.response?.data
        }
      });
    }



  }
});


import {
  GoogleGenAI,
} from '@google/genai';
import { create } from 'domain';




async function RenderChatbotTimHieu(timhieu) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY1,
  });
  const config = {
    responseMimeType: 'text/plain',
  };
  const model = 'gemma-3-27b-it';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Bạn là một trợ lý ảo hỗ trợ người dùng tại trang web  Onthithpt2026.com 
          Bạn hãy trả lời câu hỏi sau: ${timhieu}`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = '';
  for await (const chunk of response) {
    if (chunk.text !== undefined) {
      fileIndex += chunk.text;

    }
  }

  return fileIndex
}



app.post("/api/chatbot", async (req, res) => {
  try {
    const { timhieu } = req.body;

    if (!timhieu || timhieu.includes('$')) {
      return res.json({ error: "Lỗi: Nội dung input không hợp lệ" });
    }

    const chatbot = await RenderChatbotTimHieu(timhieu);

    if (!chatbot) {
      return res.json({ error: "Lỗi: Không nhận được phản hồi từ chatbot" });
    }

    const botContent = chatbot
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Dùng <strong> cho đậm
      .replace(/\n\*/g, '<br/>•') // Xử lý gạch đầu dòng
      .replace(/\n/g, '<br/>');     // Chuyển các dấu xuống dòng thành <br/>





    res.json({
      status: "ok",
      data: [{ user: timhieu, chatbot: botContent }]
    });

  } catch (error) {
    console.error("Lỗi API chatbot:", error);
    res.json({ error: "Đã xảy ra lỗi khi xử lý yêu cầu" });
  }
});

app.post('/xuat', async (req, res) => { // Sửa lại thứ tự (req, res)

  // Toàn bộ logic phải nằm trong hàm này
  try {
    const text = `Dữ Liệu kết quả là:
Chào bạn,

Tôi là trợ lý ảo được phát triển bởi đội ngũ  Onthithpt2026.com. Về câu hỏi "Tôi có uy tín không?", tôi xin trả lời như sau:

**Uy tín của tôi đến từ:**

* **Nguồn gốc:** Tôi được xây dựng và vận hành bởi  Onthithpt2026.com, một trang web uy tín trong lĩnh vực khoa học và công nghệ tại Việt Nam.
* **Dữ liệu:** Tôi được huấn luyện trên một lượng lớn dữ liệu khoa học, công nghệ và kiến thức tổng hợp, đảm bảo tính chính xác và đáng tin cậy của thông tin.
* **Mục tiêu:** Mục tiêu của tôi là cung cấp thông tin hữu ích, chính xác và khách quan cho người dùng. Tôi luôn cố gắng trả lời các câu hỏi một cách đầy đủ và dễ hiểu nhất.
* **Tính minh bạch:** Tôi là một mô hình ngôn ngữ lớn, và đôi khi có thể đưa ra những câu trả lời chưa hoàn toàn chính xác. Tuy nhiên, tôi luôn cố gắng học hỏi và cải thiện để nâng cao chất lượng dịch vụ.

**Tuy nhiên, bạn cũng cần lưu ý:**

* Tôi là một công cụ hỗ trợ, không phải là chuyên gia. Thông tin tôi cung cấp chỉ mang tính tham khảo và không thay thế cho lời khuyên của các chuyên gia.
* Bạn nên kiểm chứng thông tin tôi cung cấp từ nhiều nguồn khác nhau để đảm bảo tính chính xác.      

**Tóm lại:** Tôi cố gắng hết mình để trở thành một trợ lý ảo uy tín và hữu ích cho người dùng  Onthithpt2026.com.

Nếu bạn có bất kỳ câu hỏi nào khác, đừng ngần ngại hỏi tôi nhé!`;

    // Gán kết quả của replace cho một biến mới
    const htmlText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Dùng <strong> cho đậm
      .replace(/\n\*/g, '<br/>•') // Xử lý gạch đầu dòng
      .replace(/\n/g, '<br/>');     // Chuyển các dấu xuống dòng thành <br/>

    // Gửi phản hồi JSON với chuỗi đã được xử lý
    res.json({ message: htmlText });

  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
});


app.post('/api/thongbao', async (req, res) => {
  const newthongbao = await Thongbao.find()
  console.log(newthongbao)
  return res.json({ data: newthongbao[0].text })

})

app.post('/api/ip', async (req, res) => {



  let data = await Ip.create({
    id: 1,
    timeDay: new Date(2025, 6, 18),
    timeTuan: new Date(2025, 6, 25),
    timeThang: new Date(2025, 7, 18),
    ip1ngay: [],
    ip1tuan: [],
    ip1thang: [],
    ipall: [],
    backlist: [],
    totalngay: 0,
    totaltuan: 0,
    totalall: 0,
    totalthang: 0,



  })
  return res.json({ message: "Successfully" })


})


app.post('/api/traffic', async (req, res) => {
  const { ip } = req.body;
  let data = await Ip.findOne({ id: 1 });


  try {
    data.totalngay += 1
    data.totaltuan += 1
    data.totalall += 1
    data.totalthang += 1

    await Ip.updateOne(
      { "id": 1 },
      {
        $set: {
          totalngay: data.totalngay,
          totaltuan: data.totaltuan,
          totalall: data.totalall,
          totalthang: data.totalthang,
        }
      }
    )

    const time = new Date();

    // Kiểm tra tháng
    let resultThang = Math.floor((data.timeThang - time) / (1000 * 60 * 60 * 24))
    if (resultThang <= 0) {
      await Ip.updateOne(
        { "id": 1 },
        {
          $push: {
            "ip1thang": { total: data.totalthang, time: time }
          }
        }
      )
      const newDateThang = new Date(time.getTime() + 30 * 24 * 60 * 60 * 1000)
      await Ip.updateOne(
        { "id": 1 },
        {
          $set: {
            timeThang: newDateThang,
            totalthang: 0,
          }
        }
      )
    }

    // Kiểm tra tuần
    let resultTuan = Math.floor((data.timeTuan - time) / (1000 * 60 * 60 * 24))
    if (resultTuan <= 0) {
      await Ip.updateOne(
        { "id": 1 },
        {
          $push: {
            "ip1tuan": { total: data.totaltuan, time: time }
          }
        }
      )
      const newDateTuan = new Date(time.getTime() + 7 * 24 * 60 * 60 * 1000)
      await Ip.updateOne(
        { "id": 1 },
        {
          $set: {
            timeTuan: newDateTuan,
            totaltuan: 0,
          }
        }
      )
    }

    // Kiểm tra ngày
    let resultNgay = Math.floor((data.timeDay - time) / (1000 * 60 * 60 * 24))
    if (resultNgay <= 0) {
      await Ip.updateOne(
        { "id": 1 },
        {
          $push: {
            "ip1ngay": { total: data.totalngay, time: time }
          }
        }
      )
      const newDateNgay = new Date(time.getTime() + 1 * 24 * 60 * 60 * 1000)
      await Ip.updateOne(
        { "id": 1 },
        {
          $set: {
            timeDay: newDateNgay,
            totalngay: 0,
          }
        }
      )
    }

    return res.json({ message: "Successfully" })
  } catch (error) {
    return res.json(error)
  }
})


app.post('/api/renderTraffic', async (req, res) => {
  const data = await Ip.findOne({ id: 1 })
  return res.json({ data: data })
})





app.post('/api/vananh', async (req, res) => {
  try {
    await Toan.create({
      test: "hello"
    })

    return res.json({ status: "successfully" })
  }
  catch (error) {
    return res.json({ status: error })
  }
})


import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { vault } from 'googleapis/build/src/apis/vault/index.js';

app.post('/api/send', async (req, res) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.API_MAIL1,
  });

  const sentFrom = new Sender("admin@onthithpt2026.com", "Your name");

  const recipients = [
    new Recipient("abcgohan123mam@gmail.com", "Your Client")
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("This is a Subject")
    .setHtml("<strong>This is the HTML content</strong>")
    .setText("This is the text content");

  await mailerSend.email.send(emailParams);
})



app.post("/deleteMON", async (req, res) => {
  const data = [
    { email: "hoangthitrang@gmail.com" },
    { email: "thanhkhia1@gmal.com" },
    { email: "tieubach2909@gamil.com" },
    { email: "hoangthitrang290108@gmail.com" },
    { email: "hyhahaok@gmail.com" },
    { email: "thuymui0907@gmail.com" },
    { email: "mt9433294@gmail.com" },
    { email: "quelam666@hmail.com" },
    { email: "Hoahox34343@gmail.com" },
    { email: "vktaejudaicucm@gmail.com" },
    { email: "nhu6102008@gmail.com" },
    { email: "mt9433294@gmail.com" },
    { email: "thanhkhia1@gmal.com" },
    { email: "nottmadisonlol@gmail.com" },
    { email: "phuonguyenpham2802@gmail.com" },

  ]
  try {
    for (const item of data) {
      await Hoahoc.deleteOne({ email: data.email })
      await Toan.deleteOne({ email: data.email })
      await NguVan.deleteOne({ email: data.email })
      await Ngoaingu.deleteOne({ email: data.email })
      await Vatly.deleteOne({ email: data.email })
      await Toan.deleteOne({ email: data.email })
      await Dataemail.deleteOne({ email: data.email })
      await Hoahoc.deleteOne({ email: data.email })
      await Dialy.deleteOne({ email: data.email })
      await Lichsu.deleteOne({ email: data.email })
      await Tinhoc.deleteOne({ email: data.email })
      await Congnghe.deleteOne({ email: data.email })
    }
    return res.json({ status: "Success" })
  } catch (error) {
    return res.json({ status: "error", message: error })
  }
})




import MailChaoMung from './Mail/MailChao.js'

app.post("/api/TaiLieu2k8Auto", async (req, res) => {
  try {
    const {
      email,
      name,
      toan,
      ngoaingu,
      van,
      vatly,
      hoahoc,
      sinhhoc,
      dialy,
      lichsu,
      giaoduckinhtevaphapluat,
      tinhoc,
      congnghe
    } = req.body






    console.log("------------------------------------------")
    console.log("Các Dât Được Thêm Vào Là:")
    const checkEmail = await Dataemail.findOne({ email: email })

    if (!checkEmail) {


      if (toan) {

        await Toan.create({
          name: name,
          email: email,
          monhoc: "Toán",
          click: 0,
          bot: false,
        })
        console.log("Môn Toán :", email)

      }
      if (van) {

        await NguVan.create({
          name: name,
          email: email,
          monhoc: "Văn",
          click: 0,
          bot: false,
        })
        console.log("Môn Văn :", email)

      }

      if (ngoaingu) {

        await Ngoaingu.create({
          name: name,
          email: email,
          monhoc: "Ngoại ngữ",
          click: 0,
          bot: false,
        })
        console.log("Môn Ngoại Ngữ :", email)
      }

      if (lichsu) {

        await Lichsu.create({
          name: name,
          email: email,
          monhoc: "Lịch sử",
          click: 0,
          bot: false,
        })
        console.log("Môn Lịch Sử :", email)

      }

      if (vatly) {

        await Vatly.create({
          name: name,
          email: email,
          monhoc: "Vật lý",
          click: 0,
          bot: false,
        })
        console.log("Môn Vật Lý :", email)

      }


      if (sinhhoc) {
        console.log("Sinh Học")
        await Sinhhoc.create({
          name: name,
          email: email,
          monhoc: "Sinh Học",
          click: 0,
          bot: false,
        })
        console.log("Môn Sinh Học :", email)

      }

      if (dialy) {
        console.log("Địa Lý")
        await Dialy.create({
          name: name,
          email: email,
          monhoc: "Địa Lý",
          click: 0,
          bot: false,
        })
        console.log("Môn Địa Lý :", email)

      }


      if (giaoduckinhtevaphapluat) {

        await Giaoduckinhtevaphapluat.create({
          name: name,
          email: email,
          monhoc: "Giáo dục kinh tế và pháp luật",
          click: 0,
          bot: false,
        })
        console.log("Môn Giáo dục kinh tế và pháp luật :", email)

      }

      if (tinhoc) {
        console.log("tin hoc")
        await Tinhoc.create({
          name: name,
          email: email,
          monhoc: "Tin học",
          click: 0,
          bot: false,
        })
        console.log("Môn Tin Học :", email)

      }

      if (hoahoc) {

        await Hoahoc.create({
          name: name,
          email: email,
          monhoc: "Hóa Học",
          click: 0,
          bot: false,
        })
        console.log("Môn Hóa học :", email)

      }


      if (congnghe) {

        await Congnghe.create({
          name: name,
          email: email,
          monhoc: "Công Nghệ",
          click: 0,
          bot: false,
        })
        console.log("Môn Công Nghệ :", email)

      }
      console.log(email)
      const dataMail = {
        sendto: email,
        name: name
      }
      const chaomung = await MailChaoMung(dataMail);

      await Dataemail.create({
        name: name,
        email: email,
        monhoc: null,
        click: 0,
        bot: false,
      })

      const dataEmail = await Ip.findOne({ id: 1 })
      await Ip.updateOne(
        { "id": 1 },
        {
          $set: {
            TotalEmail: dataEmail.TotalEmail + 1,
          }
        }
      )

      res.status(200).json({ status: "success", message: "Chúc bạn đăng kí thành công, thư sẽ sớm gửi tới bạn và muộn nhất là 24h sau" });


    } else {
      res.status(200).json({ message: "Email của bạn đã có trong hệ thống" });

    }




  } catch (error) {
    console.log(error.message)
    res.status(200).json({ message: "Thất Bại, Liên Hệ Admin Để được hỗ trợ" });
  }

})











app.post("/delete", async (req, res) => {
  await Dataemail.deleteMany()
  await Toan.deleteMany()
  await NguVan.deleteMany()
  await Ngoaingu.deleteMany()
  await Lichsu.deleteMany()
  await Vatly.deleteMany()
  await Sinhhoc.deleteMany()
  await Dialy.deleteMany()
  await Giaoduckinhtevaphapluat.deleteMany()
  await Tinhoc.deleteMany()
  await Congnghe.deleteMany()



  return res.json({ statuss: "SuccessFully" })
})




app.post("/api/checkemailtailieu", async (req, res) => {
  const { email } = req.body
  const check = await Dataemail.findOne({ email: email })
  if (check) {
    return res.json({ status: "success" })
  } else {
    return res.json({ status: "false" })
  }
})





import PostalSender from './Mail/Guitailieu.js'
import QuangCaoWeb from './Mail/Quangcaoweb.js'
import Postal from '@atech/postal';
app.post("/api/send-postal", async (req, res) => {
  const {
    Monhoc, // Tìm các học sinh trong môn học này 
    Subject,  // Tiêu đề của email hiểu thị trong inbox
    TitleTaiLieu,
    download,
  } = req.body
  console.log("Bắt Đầu")




  let data = [

    { email: "abcgohan123mam@gmail.com", name: "Nguyen Van Anh", mon: "Toán" },

  ]
  // data = await Dataemail.find()



  // if(Monhoc === 'toan'){
  //   data = await Toan.find()

  // }
  // if(Monhoc === 'nguvan'){ 
  //   data = await NguVan.find()

  // }
  // if(Monhoc === 'ngoaingu'){ 
  //    data = await Ngoaingu.find()

  // }
  // if(Monhoc === 'dialy'){ 
  //   data = await Dialy.find()
  // }
  // if(Monhoc === 'lichsu'){ 
  //    data = await Lichsu.find()
  // }
  // if(Monhoc === 'vatly'){ 
  //  data = await Vatly.find()
  // }
  // if(Monhoc === 'hoahoc'){ 
  //   data = await Hoahoc.find()
  // }
  // if(Monhoc === 'sinhhoc'){ 
  //    data = await Sinhhoc.find()
  // }
  // if(Monhoc === 'giaoduckinhtevaphapluat'){ 
  //   data = await Giaoduckinhtevaphapluat.find()
  // }
  // if(Monhoc === 'tinhoc'){ 
  //    data = await Tinhoc.find()
  // }
  // if(Monhoc === 'congnghe'){ 
  //    data = await Congnghe.find()
  // }
  console.log(data)
  let i = 1

  for (const item of data) {
    console.log("SST: ", i)
    i = i + 1
    let CacMonHocSinhCo = ``
    let checkToan = await Toan.findOne({ email: item.email })
    const checkNguvan = await Ngoaingu.findOne({ email: item.email })
    const checkNgoaingu = await Ngoaingu.findOne({ email: item.email })
    const checkLichsu = await Lichsu.findOne({ email: item.email })
    const checkDialy = await Dialy.findOne({ email: item.email })
    const checkGiaoduckinhte = await Giaoduckinhtevaphapluat.findOne({ email: item.email })
    const checkVatly = await Vatly.findOne({ email: item.email })
    const checkHoahoc = await Hoahoc.findOne({ email: item.email })
    const checkSinhhoc = await Sinhhoc.findOne({ email: item.email })
    const checkTinhoc = await Tinhoc.findOne({ email: item.email })
    const checkCongnghe = await Congnghe.findOne({ email: item.email })

    if (checkToan) {
       
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">🧮</div>
        <div class="course-title">Toán Học: Phát Triển Năng Lực Tư Duy</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Ôn tập chuyên sâu kiến thức và các dạng toán theo Chương trình GDPT 2018.</li>
            <li>Rèn luyện tư duy logic, phân tích và giải quyết vấn đề thực tiễn.</li>
            <li>Luyện tập các phương pháp giải bài linh hoạt, sáng tạo, ứng dụng cao.</li>
            <li>Cập nhật cấu trúc đề thi THPTQG 2026 và các dạng câu hỏi vận dụng, vận dụng cao.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkNguvan) {
     
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">✍️</div>
        <div class="course-title">Ngữ Văn: Nâng Cao Năng Lực Đọc, Viết</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Phân tích, cảm thụ sâu sắc các tác phẩm văn học theo định hướng mới.</li>
            <li>Rèn luyện kỹ năng đọc hiểu văn bản thông tin, văn bản văn học đa dạng.</li>
            <li>Phát triển năng lực viết các dạng bài nghị luận (xã hội, văn học) và bài văn thuyết minh.</li>
            <li>Củng cố năng lực tư duy phản biện, đánh giá và bày tỏ quan điểm cá nhân.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }

    if (checkNgoaingu) {
      
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">🗣️</div>
        <div class="course-title">Ngoại Ngữ (Tiếng Anh): Giao Tiếp & Vận Dụng</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Củng cố toàn diện ngữ pháp, từ vựng theo khung năng lực ngôn ngữ.</li>
            <li>Phát triển năng lực giao tiếp (nghe, nói, đọc, viết) trong các ngữ cảnh khác nhau.</li>
            <li>Luyện tập các dạng bài thi chuẩn quốc tế và bám sát đề thi THPTQG 2026 mới.</li>
            <li>Tăng cường khả năng tư duy và sử dụng tiếng Anh một cách tự tin.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkLichsu) {
     
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">📜</div>
        <div class="course-title">Lịch Sử: Hiểu Sâu, Kết Nối Hiện Tại</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Nghiên cứu các chuyên đề lịch sử Việt Nam và thế giới theo Chương trình GDPT 2018.</li>
            <li>Phát triển năng lực tìm hiểu, đánh giá các sự kiện và nhân vật lịch sử.</li>
            <li>Kết nối kiến thức lịch sử với các vấn đề đương đại và ý nghĩa thực tiễn.</li>
            <li>Luyện tập các dạng câu hỏi trắc nghiệm khách quan vận dụng tư duy.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkDialy) {
     
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">🗺️</div>
        <div class="course-title">Địa Lý: Phân Tích & Ứng Dụng Thực Tiễn</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Hệ thống kiến thức về Địa lí tự nhiên, dân cư, kinh tế Việt Nam và thế giới.</li>
            <li>Rèn luyện kỹ năng đọc, phân tích bản đồ, Atlat và các loại biểu đồ, số liệu.</li>
            <li>Vận dụng kiến thức để giải thích các hiện tượng tự nhiên, kinh tế, xã hội.</li>
            <li>Chuẩn bị cho các dạng câu hỏi thực hành và lý thuyết gắn với thực tiễn.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkGiaoduckinhte) {
       
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">⚖️</div>
        <div class="course-title">GD Kinh tế & Pháp luật: Công Dân Tương Lai</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Nắm vững kiến thức cốt lõi về kinh tế và pháp luật theo Chương trình GDPT 2018.</li>
            <li>Phát triển năng lực tư duy và vận dụng pháp luật vào các tình huống thực tiễn.</li>
            <li>Rèn luyện kỹ năng nhận diện, phân tích và giải quyết các vấn đề kinh tế, pháp lý, đạo đức.</li>
            <li>Làm quen với cấu trúc đề thi THPTQG 2026 mới: Trắc nghiệm đa lựa chọn và Trắc nghiệm Đúng/Sai.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkVatly) {
      
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">💡</div>
        <div class="course-title">Vật Lý: Năng Lực Giải Quyết Vấn Đề</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Tổng hợp và vận dụng linh hoạt các định luật, công thức vật lý.</li>
            <li>Phát triển năng lực tư duy khoa học, phân tích và giải quyết các bài toán thực tiễn.</li>
            <li>Thực hành các dạng bài tập định tính và định lượng, từ cơ bản đến nâng cao.</li>
            <li>Tiếp cận các phương pháp thí nghiệm ảo, mô phỏng và ứng dụng vật lý trong đời sống.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }

    if (checkHoahoc) {
     
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">🧪</div>
        <div class="course-title">Hóa Học: Tư Duy Hóa Học & Thực Nghiệm</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Hệ thống hóa kiến thức hóa học vô cơ và hữu cơ theo chuyên đề.</li>
            <li>Rèn luyện năng lực phân tích, tính toán và giải quyết các bài toán hóa học phức tạp.</li>
            <li>Vận dụng kiến thức để giải thích các hiện tượng, quá trình hóa học trong tự nhiên và đời sống.</li>
            <li>Làm quen với các câu hỏi thực nghiệm, tư duy phản ứng và ứng dụng hóa học.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkSinhhoc) {
     
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">🧬</div>
        <div class="course-title">Sinh Học: Hiểu Về Sự Sống & Ứng Dụng</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Nghiên cứu kiến thức về di truyền, tiến hóa, sinh thái và cơ thể sống theo chương trình mới.</li>
            <li>Phát triển năng lực phân tích sơ đồ, hình ảnh và xử lý số liệu sinh học.</li>
            <li>Vận dụng kiến thức để giải quyết các vấn đề thực tiễn liên quan đến sinh học.</li>
            <li>Làm quen với các dạng câu hỏi tổng hợp, liên hệ và ứng dụng sinh học trong y học, nông nghiệp.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkTinhoc) {
 
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">💻</div>
        <div class="course-title">Tin Học: Tư Duy Thuật Toán & Lập Trình</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Phát triển tư duy thuật toán, cấu trúc dữ liệu và giải quyết vấn đề bằng máy tính.</li>
            <li>Thực hành lập trình cơ bản và nâng cao (ví dụ: Python, Pascal, C++) để giải quyết các bài toán thực tế.</li>
            <li>Tìm hiểu về mạng máy tính, internet, an toàn thông tin và các ứng dụng AI cơ bản.</li>
            <li>Luyện tập các dạng bài thi THPTQG 2026 chú trọng vào năng lực lập trình và tư duy logic.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }
    if (checkCongnghe) {
     
      CacMonHocSinhCo = CacMonHocSinhCo + `<div class="course-card">
    <div class="course-header">
        <div class="course-icon">⚙️</div>
        <div class="course-title">Công Nghệ: Thiết Kế & Ứng Dụng Thực Tiễn</div>
    </div>
    <div class="course-body">
        <ul class="course-features">
            <li>Hệ thống kiến thức Công nghệ theo định hướng Công nghiệp hoặc Nông nghiệp.</li>
            <li>Phát triển năng lực thiết kế, đánh giá và giải quyết vấn đề kỹ thuật.</li>
            <li>Phân tích các quy trình công nghệ, nguyên lý hoạt động của sản phẩm.</li>
            <li>Vận dụng kiến thức để hiểu và tạo ra các sản phẩm công nghệ trong đời sống.</li>
        </ul>
        <a href="https://onthithpt2026.com/home" class="course-link">ĐĂNG KÝ NGAY</a>
    </div>
</div>`
    }

    const uniqueId = uuidv4()
    await Urlemail.create({
      id: uniqueId,
      email: item.email,
      url: download,
      click: 0
    })

    let dataMail = {
      sendto: item.email,
      name: item.name,
      Subject: Subject,
      TitleTaiLieu: TitleTaiLieu,
      CacMonHocSinhCo: CacMonHocSinhCo,
      download: uniqueId,

    }


    const data = await PostalSender(dataMail)
    console.log(data)


    console.log("Hãy Đợi 10 Giây Để Có Thể Gửi Tiếp")
    for (let i = 10; i > 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây
      console.log(`Chờ ${i} giây...`);
    }

    console.log("------------------------------------------------------")



  }
  return res.json({ status: "Đã gửi hoàn tất" })





})

app.post("/referralCode", async (req, res) => {
  const { id } = req.params;
  await User.updateOne(
    { email: "" }
  )

  return res.json(id)


})



app.post("/tailieufree", async (req, res) => {
  const { id } = req.body
  const data = await Urlemail.findOne({ id: id })
  if (data) {
    await Urlemail.updateOne(
      { id: id },
      {
        $set: {
          click: data.click + 1
        }
      }
    )
    const dataIp = await Ip.findOne({ id: 1 })
 
     
      await Ip.updateOne(
      { id: 1 },
      {
        $set: {
          clickEmail: dataIp.clickEmail + 1
        }
      }
    )
    


    
    return res.json({ status: "success", url: data.url })
  } else {
    return res.json({ status: "false" })
  }



  return res.json(uniqueId)

  //   const data = await Sendtest.findOne({email: id})
  //   if(data){
  //     await Sendtest.updateOne(
  //       {email: id}, 
  //       {
  //           $set: {
  //             click: data.click + 1,
  //           }
  //         }
  //     )
  //   } else { 
  //  await Sendtest.create({ 
  //    name: 'String',
  //    email: id,
  //    monhoc: 'String',
  //    click: 0,
  //    bot: true,
  //   })
  //   }



})





app.post("/api/ResetThong", async (req, res) => {
  console.log("Bắt đầu")
  const Data = await Thongbao.findOne({ id: 562006 })
  return Data.text

})





app.post("/TaiLieu2k8Autoo", async (req, res) => {
  const { referralCode } = req.params
  console.log(referralCode)
  res.json({ referralCode: referralCode })
})



const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
server.setTimeout(30 * 1000, socket => socket.destroy());
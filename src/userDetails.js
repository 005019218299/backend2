


import mongoose from 'mongoose';

const OndersDetailsSchema = new mongoose.Schema({
    email: String,
    orderCode : Number,
    amount: Number,
    description:String,
    status: String,
    time: String,
    sodu: Number,
}, {
    collection: "Oders",
 
});
const NguoimoiduocSchema = new mongoose.Schema({
    email: { 
        type: String
    }

},{
    collection: "nguoimoiduoc",
 
})


 

const UserDetailsSchema = new mongoose.Schema({



    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, "Tên đăng nhập chỉ được chứa chữ cái và số"] // Chống NoSQL Injection
    },

    nguoigioithieu: { 
        type: String,
    },
    nguoimoiduoc: { 
        type: [NguoimoiduocSchema] //email
    },
    

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    sodu: {
        type: Number,
        default: 0,
        min: 0
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email không hợp lệ"]
    },
    Math: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    literature: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    english: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    physics: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    chemistry: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    biology: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    geography: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    history: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    admin: {
        type: Boolean,
        default: false, // Mặc định không phải admin
        immutable: true // Chỉ set thủ công trong database
    },
    checkToan: {
        type: Boolean,
        default: false
    },
    checkVan: {
        type: Boolean,
        default: false
    },
    checkTienganh: {
        type: Boolean,
        default: false
    },
    checkSinh: {
        type: Boolean,
        default: false
    },
    checkLy: {
        type: Boolean,
        default: false
    },
    checkHoa: {
        type: Boolean,
        default: false
    },
    checkSu: {
        type: Boolean,
        default: false
    },
    checkDia: {
        type: Boolean,
        default: false
    },
    doanhthu: {
        type: Number,
        default: 0,
        min: 0
    },
    danso: {
        type: Number,
        default: 0,
        min: 0
    },
    order: [OndersDetailsSchema],
    damua : [],
    hocthu: [],
    vocher: [],
}, {
    collection: "UserInfo2",
    timestamps: true // Thêm created_at và updated_at
});

const TaiLieuDetailsSchema = new mongoose.Schema({
    linkimg: {
        type: String,
        required: true,
        match: [/^(http|https):\/\/[^ "]+$/, "Link ảnh không hợp lệ"]
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    linkdownload: {
        type: String,
        required: true,
        match: [/^(http|https):\/\/[^ "]+$/, "Link download không hợp lệ"]
    }
}, {
    collection: "Tailieu",
    timestamps: true
});

const VideosCourceDetailsShema = new mongoose.Schema ({ 
    title: String, 
    linkVideo: String,
    idVideo: String,
 }, { 
     collation: "VideosCourse",
 })


 

const DanhMucCourseDetailsShema = new mongoose.Schema ({ 
    idDanhMuc: String,
    title: String, 
    Videos: [VideosCourceDetailsShema],

}, {
     collection: "DanhMucCourse",
});


const KhoahocDetailsSchema = new mongoose.Schema({
    id : String,
    title: String,
    introduceCourse:  String,
    ContentCourse: String,
    price : Number,
    imgCourse:  String,
    author: String,
    introduceAuthor: String,
    priceSale:  Number,
    luotmua: Number,
    idCate: String,

    DanhMucCourse: [DanhMucCourseDetailsShema],

}, {
    collection: "khoahoc",
 
});



const CategoryDetailsSchema = new mongoose.Schema({
    idCate : String,
    titleCate: String,
    img: String,
    listCate : [KhoahocDetailsSchema],
    

}, {
    collection: "Category",
 
});

 
const PathDetailsSchema = new mongoose.Schema({
    idPath : String,
 
    

}, {
    collection: "pathCourse",
 
});

const vocherDetailsSchema = new mongoose.Schema({
    idVocher : String,
    CodeVocher: String,
    priceVocher: Number,
    
}, { 
    collection: "vocher",
});


const feedbackDetailsSchema = new mongoose.Schema({
    name : String,
    img: String,
    content: String,
    


}, {
    collection: "feedback",
});



const ThongbaoSchema = new mongoose.Schema({ 
    text: String,
    id: Number,
}, { 
    collection: "thongbao",
})
const ipTongSchema = new mongoose.Schema({
    total: Number,
    time: String,
})

const IpSchemma = new mongoose.Schema({ 
    id: Number,
    day: Number,
    timeDay: String,
    timeTuan: String, 
    timeThang: String,
    ip1ngay: [ipTongSchema],
    ip1tuan: [ipTongSchema],
    ip1thang: [ipTongSchema],
    ipall: [ipTongSchema],
    backlist: [ipTongSchema],
    totalngay: Number,
    totaltuan: Number,
    totalall: Number,
    totalthang: Number,
    TotalEmail: Number,
    clickEmail: Number
     
    

},{ 
     collection: "ip",
})



const ToanSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "toan",
})



const SendTestSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "sendtest",
})

const NguVanSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "nguvan",
})



const NgoaiNguSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "ngoaingu",
})


 


const LichSuSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "lichsu",
})


const VatLySchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "vatly",
})



const SinhHocSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "sinhhoc",
})



const DiaLySchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "dialy",
})



const GiaoduckinhtevaphapluatSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "giaoduckinhtevaphapluat",
     
})



const TinHocSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "tinhoc",
})
const CongNgheSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "congnghe",
})

const HoaHocSchema  = new mongoose.Schema({ 
   name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
}, { 
     collection: "hoahoc",
})



const DataEmailSchema  = new mongoose.Schema({ 
 
    name: String,
   email: String,
   monhoc: String,
   click: Number,
   bot: Boolean,
    
}, { 
     collection: "dataemail",
})


const UrlEmailSchema = new mongoose.Schema({
    id: String,
    email: String, 
    url: String,
    click: Number
}, { 
     collection: "urlemail",
})






// Middleware tự động làm sạch dữ liệu trước khi lưu
UserDetailsSchema.pre('save', function(next) {
    // Xóa các ký tự đặc biệt nguy hiểm
    if (this.username) this.username = this.username.replace(/[\$<>]/g, '');
    next();
});
export const VideosCourse = mongoose.model("VideosCourse", VideosCourceDetailsShema);
export const DanhMucCourse = mongoose.model("DanhMucCourse", DanhMucCourseDetailsShema);
export const Tailieu = mongoose.model("Tailieu", TaiLieuDetailsSchema);
export const User = mongoose.model("UserInfo2", UserDetailsSchema);
export const Course  = mongoose.model("khoahoc", KhoahocDetailsSchema);
export const Category = mongoose.model("Category", CategoryDetailsSchema);
export const Orders  = mongoose.model("Oders", OndersDetailsSchema);
export const PathCourse = mongoose.model("pathCourse", PathDetailsSchema);
export const Vocher = mongoose.model("vocher", vocherDetailsSchema);
export const Feedback = mongoose.model("feedback", feedbackDetailsSchema);
export const Thongbao = mongoose.model("thongbao", ThongbaoSchema);
export const Ip = mongoose.model("ip", IpSchemma);


export const Toan = mongoose.model("toan", ToanSchema);
export const NguVan = mongoose.model("nguvan", NguVanSchema);
export const Ngoaingu = mongoose.model("ngoaingu", NgoaiNguSchema);
export const Lichsu = mongoose.model("lichsu", LichSuSchema);
export const Vatly = mongoose.model("vatly", VatLySchema);
export const Sinhhoc = mongoose.model("sinhhoc", SinhHocSchema);
export const Dialy = mongoose.model("dialy", DiaLySchema);
export const Giaoduckinhtevaphapluat = mongoose.model("giaoduckinhtevaphapluat", GiaoduckinhtevaphapluatSchema);
export const Tinhoc = mongoose.model("tinhoc", TinHocSchema);
export const Congnghe = mongoose.model("congnghe", CongNgheSchema);
export const Hoahoc = mongoose.model("hoahoc", HoaHocSchema);
export const Dataemail = mongoose.model("dataemail", DataEmailSchema);
export const Sendtest = mongoose.model("sendtest", SendTestSchema);
export const Urlemail = mongoose.model("urlemail", UrlEmailSchema);
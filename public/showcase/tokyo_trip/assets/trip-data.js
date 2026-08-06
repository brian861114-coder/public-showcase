window.TRIP_DATA = Object.freeze({
  schemaVersion: 2,
  updatedAt: '2026-07-17T21:30:00+08:00',
  canonicalSource: 'assets/trip-data.js',
  start: '2026-07-19T00:10:00+08:00',
  end: '2026-07-25T16:25:00+08:00',
  days: [
    {date:'2026-07-19',place:'河口湖',title:'KKDay 富士箱根一日遊',items:['04:25 抵達羽田 T3','08:15 西新宿集合出發','15:20–16:00 忍野八海離團','計程車前往 DOT HOSTEL']},
    {date:'2026-07-20',place:'河口湖',title:'換宿與湖畔慢遊',items:['10:00 DOT HOSTEL 退房','12:00 富士晴寄放行李','纜車、遊覽船或湖畔散步','15:00 入住富士晴']},
    {date:'2026-07-21',place:'河口湖',title:'河口湖完整一天',items:['新倉山淺間公園','日川時計店與本町通','依天氣和體力刪減景點']},
    {date:'2026-07-22',place:'箱根',title:'河口湖前往箱根仙石原',items:['10:00 富士晴退房','河口湖站轉御殿場、仙石原','UENOYAMA 入住時間待確認','下午以休息與附近散步為主']},
    {date:'2026-07-23',place:'東京',title:'仙石原美術館前往東京',items:['上午仙石原美術館散步','下午前往新宿與水道橋','入住東京巨蛋飯店']},
    {date:'2026-07-24',place:'東京',title:'東京方案日',items:['從文化下町、中央購物、都會潮流選一條','全家願望優先','7/24 前購買 Skyliner 指定席']},
    {date:'2026-07-25',place:'成田',title:'提早前往成田機場',items:['09:00 前退房','09:15 飯店出發','10:30–11:00 抵達成田 T2','13:30 起飛','16:25 抵達桃園 T1']}
  ],
  presentation: {
    partySize: 4,
    segments: [
      {code:'FLIGHT',title:'出發',detail:'7/19 凌晨虎航紅眼航班',sub:'桃園 T1 → 羽田 T3'},
      {code:'FUJI',title:'河口湖',detail:'7/19–7/22 · 3 晚',sub:'DOT HOSTEL＋富士晴'},
      {code:'HAKONE',title:'箱根',detail:'7/22–7/23 · 1 晚',sub:'UENOYAMA 仙石原'},
      {code:'TOKYO',title:'東京',detail:'7/23–7/25 · 2 晚',sub:'東京巨蛋飯店'}
    ],
    schedules: {
      day1: [
        {time:'00:10',text:'虎航起飛（桃園 T1）'},
        {time:'04:25',text:'落地羽田 T3 · 入境'},
        {time:'06:00',text:'機場巴士 → 新宿'},
        {time:'08:15',text:'KKDay 團出發',highlight:true},
        {time:'10:30',text:'箱根神社 · 湖上鳥居'},
        {time:'11:30',text:'海賊船（蘆之湖 · 30 分）'},
        {time:'12:00',text:'空中纜車 → 大湧谷'},
        {time:'13:20',text:'午餐（炸雞定食）'},
        {time:'14:10',text:'山中湖白鳥濱'},
        {time:'15:20–16:00',text:'忍野八海 · 依車況離團',highlight:true},
        {time:'約 16:30',text:'DOT HOSTEL 入住'}
      ],
      day4: [
        {time:'10:00',text:'富士晴退房'},
        {time:'10:30',text:'巴士 → 御殿場站（約 1.5 小時）'},
        {time:'12:00–13:00',text:'轉車 → 仙石原（約 30–40 分）'},
        {time:'抵達後',text:'UENOYAMA 入住時間與密碼待確認',highlight:true},
        {time:'下午',text:'拉利克博物館／威尼斯玻璃博物館／LAWSON 補給'}
      ],
      day7: [
        {time:'09:00 前',text:'東京巨蛋飯店退房'},
        {time:'09:15',text:'飯店出發 → 水道橋 → 日暮里',highlight:true},
        {time:'約 10:30–11:00',text:'Skyliner → 成田 T2',highlight:true},
        {time:'13:30',text:'虎航起飛'},
        {time:'16:25',text:'抵達桃園 T1 · 開車回台中'}
      ]
    },
    kawaguchiko: {
      day2: {
        code:'DAY 2',
        title:'週一 · 換宿與湖畔慢遊',
        lines:['10:00 DOT HOSTEL 退房','10:00–12:00 河口湖站周邊休息／補給','12:00 富士晴寄放行李','下午擇一：纜車、遊覽船或湖畔散步','15:00 入住富士晴 Guest House'],
        note:'大石公園鄰近的是 DOT HOSTEL；換宿後不再標示為「住處隔壁」。'
      },
      day3: {
        code:'DAY 3',
        title:'週二 · 河口湖完整一天',
        lines:['新倉山淺間公園','天梯小鎮（日川時計店）','富士吉田本町通','依天氣和體力決定遊覽船／大石公園','跳過五合目，保留休息時間'],
        note:'不是打卡清單；富士山被雲遮住時改走街區、咖啡或室內方案。'
      }
    },
    day5: {
      code:'DAY 5',
      title:'週四 · 箱根到東京',
      lines:['上午：仙石原美術館散步','中午：附近用餐','下午：巴士 → 箱根湯本','普通電車 → 新宿 → 水道橋','約 16:00 東京巨蛋飯店入住']
    },
    day6Options: [
      {
        code:'A',
        title:'文化下町',
        mood:'第一次東京・經典拍照',
        route:'淺草寺／仲見世 → 隅田川 → 晴空塔周邊',
        highlights:['傳統街區','伴手禮','城市景觀'],
        effort:'步行中等',
        weather:'晴天優先'
      },
      {
        code:'B',
        title:'中央購物',
        mood:'輕鬆・冷氣多・方便購物',
        route:'東京車站／丸之內 → 皇居外圍 → 銀座',
        highlights:['百貨購物','甜點美食','雨天友善'],
        effort:'步行較少',
        weather:'雨天首選',
        recommended:true
      },
      {
        code:'C',
        title:'都會潮流',
        mood:'街頭感・逛街・年輕東京',
        route:'明治神宮 → 原宿／表參道 → 澀谷',
        highlights:['神社綠意','潮流店舖','十字路口'],
        effort:'步行較多',
        weather:'避開午後酷熱'
      }
    ],
    day6Decision:'每人先說一個東京願望；以願望重疊最多的方案為主，最多保留一個加碼點。',
    lodgings: [
      {code:'STAY 01',dates:'7/19 · 1 晚',name:'DOT HOSTEL & BAR',area:'河口湖大石',detail:'大石公園 170m · 15:00–21:00'},
      {code:'STAY 02',dates:'7/20–21 · 2 晚',name:'富士晴 Guest House',area:'河口湖町河口 605-1',detail:'獨棟 Villa · 12:00 可寄放 · 15:00 入住'},
      {code:'STAY 03',dates:'7/22 · 1 晚',name:'UENOYAMA Room 102',area:'箱根仙石原',detail:'無接觸入住 · 時間與密碼待確認'},
      {code:'STAY 04',dates:'7/23–24 · 2 晚',name:'東京巨蛋飯店',area:'文京區後樂',detail:'雙床房 ×2 · 14:00 入住 · 11:00 退房'}
    ],
    prep: [
      {status:'done',title:'護照 · 機票 · 訂房',detail:'4 人護照效期 OK · 虎航確認 · 4 間住宿已訂'},
      {status:'done',title:'Visit Japan Web',detail:'4 人已填 · QR code 存手機'},
      {status:'done',title:'日圓現金 15 萬',detail:'4 人共用 · 河口湖箱根多小店只收現金'},
      {status:'done',title:'SIM 卡 · 保險',detail:'4 人各自有 SIM · 旅遊保險已保'},
      {status:'done',title:'Suica · 離線地圖',detail:'卡 ×2＋iPhone ×1＋東京再買 1 張'},
      {status:'done',title:'行動電源合規',detail:'虎航：100Wh 以下 · 隨身 · 禁機上充電'},
      {status:'done',title:'虎航線上報到',detail:'已完成 · 7/17 線上報到 4 人'},
      {status:'pack',title:'自備水＋零食上機',detail:'紅眼航班不供餐 · 3 小時飛行'},
      {status:'todo',title:'確認 UENOYAMA 指示',detail:'確認入住時間、密碼與行李安排'},
      {status:'todo',title:'買 Skyliner 回程票',detail:'7/24 前 · 依官方時刻表選指定席'}
    ],
    expectations: [
      {title:'Day 1 · 最辛苦',text:'紅眼航班接一日團。睡眠不足、移動長，車上休息比多看一個景點重要。'},
      {title:'Day 2–3 · 最有彈性',text:'河口湖慢慢走。天氣好追富士山，累了就在湖邊或咖啡店休息。'},
      {title:'Day 4–5 · 行李移動日',text:'兩次轉車、入住條件仍要確認；行程保留緩衝，不趕最後一班。'},
      {title:'Day 6 · 家人共同決定',text:'從三條東京方案選一條，以每個人的旅行願望作為優先順序。'}
    ]
  },
  search: [
    ['旅行時程','可編輯行程、甘特圖與任務','trip_timeline.html','行程 時間 日期 任務'],
    ['行前準備清單','護照、網路、保險、行李與入境','packing_checklist.html','清單 護照 esim 保險 行李'],
    ['交通完全攻略','羽田、河口湖、箱根、東京與成田交通','transportation_guide.html','交通 巴士 電車 車票 河口湖 箱根'],
    ['河口湖與箱根景點','景點、營業資訊、費用與停留時間','attractions_guide.html','景點 河口湖 箱根 大石公園 大湧谷 神社 美術館'],
    ['東京鐵路導覽','東京市區路線與轉乘節點','index.html','東京 鐵路 地圖 車站 轉乘 成田'],
    ['旅遊日語速查','餐廳、交通、飯店與緊急日語','japanese_phrases.html','日語 翻譯 餐廳 飯店'],
    ['緊急應變手冊','電話、就醫、遺失物與災害應對','emergency_guide.html','緊急 醫院 警察 遺失 地震'],
    ['旅費與分帳','預算、支出紀錄與同行者分帳','budget.html','預算 費用 分帳 日圓 台幣'],
    ['大石公園','富士山、湖景與薰衣草','attractions_guide.html#kawaguchiko','河口湖 富士山 薰衣草 收藏'],
    ['大湧谷','箱根火山地景與黑蛋','attractions_guide.html#hakone','箱根 火山 黑蛋 收藏']
  ]
});

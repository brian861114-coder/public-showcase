window.TRIP_DATA = Object.freeze({
  start: '2026-07-19T00:10:00+08:00',
  end: '2026-07-25T16:25:00+08:00',
  days: [
    {date:'2026-07-19',place:'河口湖',title:'抵達日本，前往河口湖',items:['04:25 抵達羽田 T3','前往河口湖並寄放行李','大石公園與湖畔散步']},
    {date:'2026-07-20',place:'河口湖',title:'河口湖經典景點',items:['富士山全景纜車','河口湖遊覽船','入住富士晴 Guest House']},
    {date:'2026-07-21',place:'富士五湖',title:'富士五湖彈性行程',items:['依天候選擇西湖或山中湖','保留雨天替代方案']},
    {date:'2026-07-22',place:'箱根',title:'河口湖前往箱根',items:['退房並前往仙石原','入住 UENOYAMA','濕生花園或芒草原散步']},
    {date:'2026-07-23',place:'東京',title:'箱根前往東京',items:['箱根上午行程','前往東京市區','入住東京巨蛋飯店（14:00）']},
    {date:'2026-07-24',place:'東京',title:'東京自由探索',items:['後樂園／巨蛋城周邊','依收藏景點安排路線','預留購物與用餐時間']},
    {date:'2026-07-25',place:'成田',title:'返程日',items:['11:00 前退房','水道橋→日暮里→Skyliner','13:30 起飛']}
  ],
  accommodations: [
    {id:'dot-hostel',name:'DOT HOSTEL & BAR',nameJp:'DOT HOSTEL & BAR',area:'河口湖',address:'〒401-0305 山梨縣南都留郡富士河口湖町大石 1509',addressJp:'山梨県南都留郡富士河口湖町大石1509',checkIn:'2026-07-19',checkOut:'2026-07-20',checkInTime:'15:00',checkOutTime:'10:00',platform:'Agoda'},
    {id:'fujibare',name:'富士晴 Guest House',nameJp:'富士晴 Guest House',area:'河口湖船津',address:'〒401-0301 山梨縣南都留郡富士河口湖町船津 605-1',addressJp:'山梨県南都留郡富士河口湖町船津605-1',checkIn:'2026-07-20',checkOut:'2026-07-22',checkInTime:'15:00',checkOutTime:'10:00',platform:'Agoda'},
    {id:'uenoyama',name:'Hakone UENOYAMA 上の山 Room 102',nameJp:'UENOYAMA 上の山 Room102',area:'箱根仙石原',address:'〒250-0631 神奈川縣足柄下郡箱根町仙石原 183',addressJp:'神奈川県足柄下郡箱根町仙石原183',checkIn:'2026-07-22',checkOut:'2026-07-23',platform:'Agoda'},
    {id:'tokyo-dome-hotel',name:'東京巨蛋飯店',nameJp:'東京ドームホテル',nameEn:'Tokyo Dome Hotel',area:'東京',address:'〒112-8562 東京都文京區後樂1丁目3-61',addressJp:'東京都文京区後楽1丁目3-61',tel:'+81-3-5805-2111',checkIn:'2026-07-23',checkOut:'2026-07-25',checkInTime:'14:00',checkOutTime:'11:00',station:'水道橋／後樂園',stationIds:['suidobashi','korakuen'],platform:'Trip.com',bookedAt:'2026-07-11',status:'已確認',facilities:['公共停車場','戶外泳池','按摩室','免費 Wi-Fi'],rooms:[{type:'雙床房B（9-22F 禁菸）',guest:'MEI FANG CHEN',orderId:'1616331777272466',priceTwd:9842},{type:'雙床房B（9-22F 禁菸）',guest:'WEI CHE TSENG',orderId:'1616331777308966',priceTwd:10172}],notes:'兩間雙人房共 2 晚，總價 TWD 20,014。7/25 退房後可搭 JR 總武線至日暮里轉 Skyliner 去成田。'}
  ],
  search: [
    ['旅行時程','可編輯行程、甘特圖與任務','trip_timeline.html','行程 時間 日期 任務'],
    ['行前準備清單','護照、網路、保險、行李與入境','packing_checklist.html','清單 護照 esim 保險 行李 行前'],
    ['移動總覽・交通攻略','怎麼去、買哪張券：機場、河口湖、箱根、東京與成田','transportation_guide.html','移動 交通 巴士 電車 車票 周遊券 CP 河口湖 箱根'],
    ['東京鐵路圖','東京市區互動地圖、轉乘節點與成田返程','tokyo_rail.html','移動 東京 鐵路 地圖 車站 轉乘 成田'],
    ['河口湖・箱根圖','周遊巴士、富士急行、登山線與景點換乘地圖','fuji_hakone_rail.html','移動 河口湖 箱根 巴士 纜車 周遊 登山 地圖'],
    ['河口湖・箱根・東京景點','景點、營業資訊、費用與停留時間','attractions_guide.html','景點 河口湖 箱根 東京 山手線 淺草 晴空塔 明治神宮 秋葉原 池袋 鐵塔 大石公園 大湧谷'],
    ['旅遊日語速查','餐廳、交通、飯店與緊急日語','japanese_phrases.html','日語 翻譯 餐廳 飯店 行前'],
    ['緊急應變手冊','電話、就醫、遺失物與災害應對','emergency_guide.html','緊急 醫院 警察 遺失 地震'],
    ['旅費與分帳','預算、支出紀錄與同行者分帳','budget.html','預算 費用 分帳 日圓 台幣 行前'],
    ['搜尋與收藏','跨頁查找行程、移動、景點與緊急資訊','search.html','搜尋 收藏'],
    ['大石公園','富士山、湖景與薰衣草','attractions_guide.html#kawaguchiko','河口湖 富士山 薰衣草 收藏'],
    ['大湧谷','箱根火山地景與黑蛋','attractions_guide.html#hakone','箱根 火山 黑蛋 收藏'],
    ['淺草寺・雷門','江戶風情與仲見世','attractions_guide.html#tokyo','淺草 東京 雷門 收藏'],
    ['明治神宮','原宿森林神社','attractions_guide.html#tokyo','原宿 神社 東京 收藏'],
    ['東京巨蛋飯店','後樂園住宿、兩間雙人房訂房確認與周邊交通','emergency_guide.html','巨蛋 飯店 後樂園 水道橋 住宿 訂房']
  ]
});

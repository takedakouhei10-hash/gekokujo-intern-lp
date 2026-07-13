// 下剋上インターンLP 面談申込フォーム受信用 Google Apps Script
// 設定手順は同フォルダの「フォーム設定手順.md」を参照

const NOTIFY_EMAIL = "trixia.takedakouhei@gmail.com"; // 通知の宛先
const SPREADSHEET_ID = ""; // 任意: 応募を記録するスプレッドシートのID(空なら記録しない)
const TIMEREX_URL = "https://timerex.net/s/takedakouhei.10_3963/3a66bc4b"; // Zoom面談の予約ページ(TimeRex)

function doPost(e) {
  const d = JSON.parse(e.postData.contents);

  const lines = [
    "お名前: " + (d.name || ""),
    "生年月日: " + (d.birth || ""),
    "区分: " + (d.status || ""),
    "所属大学: " + (d.university || "―"),
    "メール: " + (d.email || ""),
    "電話番号: " + (d.phone || ""),
    "送信日時: " + (d.sentAt || ""),
  ].join("\n");

  // 1) 武田さんへ通知メール
  GmailApp.sendEmail(
    NOTIFY_EMAIL,
    "【下剋上インターン】面談申込: " + (d.name || "名前未入力"),
    lines + "\n\n※ Zoom面談の日程は応募者がTimeRexから予約します。TimeRexの予約通知をあわせてご確認ください。"
  );

  // 2) スプレッドシートに記録(任意)
  if (SPREADSHEET_ID) {
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0].appendRow([
      new Date(), d.name, d.birth, d.status, d.university, d.email, d.phone,
    ]);
  }

  // 3) 応募者へ自動返信(TimeRexの予約リンク付き)
  if (d.email) {
    GmailApp.sendEmail(
      d.email,
      "【下剋上インターン】お申し込みを受け付けました",
      (d.name || "") + " 様\n\n" +
      "下剋上インターンへのご応募ありがとうございます。\n" +
      "お申し込みを受け付けました。\n\n" +
      "Zoom面談の日程は、以下のページからご都合のよい枠をご予約ください。\n" +
      TIMEREX_URL + "\n\n" +
      "（面談は30分程度・服装自由です）\n" +
      "ご不明な点があれば、このメールにそのままご返信ください。\n\n" +
      "――――――――――――――――\n" +
      "株式会社TRIXIA 下剋上インターン運営\n" +
      "北海道札幌市中央区大通東7丁目12-15 ノースシティアンザイ\n"
    );
  }

  return ContentService.createTextOutput("ok");
}

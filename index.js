const fs = require("fs");
const csv = require("csv-parser");

const redirects = {};

fs.createReadStream("redirects.csv")
  .pipe(csv())
  .on("data", (row) => {
    const oldPath = row["Old Product handle"];
    const newPath = row["NEW Product Handle"];
    if (oldPath && newPath) {
      redirects[oldPath] = newPath;
    }
  })
  .on("end", () => {
    fs.writeFileSync("productRedirectMap.json", JSON.stringify(redirects, null, 2));
    console.log("✅ productRedirectMap.json created");
  });

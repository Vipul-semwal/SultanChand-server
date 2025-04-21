import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ExcelJS from "exceljs";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve("query");
    console.log('danda')
    const { data, metadata } = await query.graph({
      entity: "publish",
      fields: [
        "id",
        "author_name",
        "institute_name",
        "email",
        "city",
        "country",
        "contact_number",
        "discipline",
        "synopsis",
        "about_author",
        "author_affiliation",
        "address",
        "state",
        "pin_zip",
        "title_of_book",
        "subject",
        "status_of_book",
        "created_at",
      ],
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Publications");

    // Define worksheet columns with all fields
    worksheet.columns = [
      { header: "ID", key: "id", width: 15 },
      { header: "Author Name", key: "author_name", width: 25 },
      { header: "Institute Name", key: "institute_name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "City", key: "city", width: 15 },
      { header: "Country", key: "country", width: 15 },
      { header: "Contact Number", key: "contact_number", width: 20 },
      { header: "Discipline", key: "discipline", width: 20 },
      { header: "Synopsis", key: "synopsis", width: 40 },
      { header: "About Author", key: "about_author", width: 40 },
      { header: "Author Affiliation", key: "author_affiliation", width: 25 },
      { header: "Address", key: "address", width: 40 },
      { header: "State", key: "state", width: 15 },
      { header: "Pin/Zip", key: "pin_zip", width: 10 },
      { header: "Title of Book", key: "title_of_book", width: 30 },
      { header: "Subject", key: "subject", width: 25 },
      { header: "Status of Book", key: "status_of_book", width: 20 },
      { header: "Created At", key: "created_at", width: 20 },
    ];
    // console.log("data", worksheet.columns);

    // Add data rows
    data.forEach((publication) => {
      worksheet.addRow({
        id: publication.id,
        author_name: publication.author_name,
        institute_name: publication.institute_name,
        email: publication.email,
        city: publication.city,
        country: publication.country,
        contact_number: publication.contact_number,
        discipline: publication.discipline,
        synopsis: publication.synopsis,
        about_author: publication.about_author,
        author_affiliation: publication.author_affiliation,
        address: publication.address,
        state: publication.state,
        pin_zip: publication.pin_zip,
        title_of_book: publication.title_of_book,
        subject: publication.subject,
        status_of_book: publication.status_of_book,
        created_at:
          publication.created_at instanceof Date
            ? publication.created_at
            : new Date(publication.created_at),
      });
    });

    // Style header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
    });
   

    // Format date column (assuming Created At is the 18th column)
    worksheet.getColumn(18).numFmt = "yyyy-mm-dd hh:mm:ss";
    console.log('working',worksheet.workbook.xlsx)

    // Generate Excel buffer
    // const buffer = await workbook.xlsx.writeBuffer();
    // console.log("buffer", buffer.byteLength);

    // Set download headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=publications_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
    console.log("Export successful");
  } catch (error: any) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to generate export file",
    });
  }
};

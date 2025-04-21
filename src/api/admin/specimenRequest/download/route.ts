import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ExcelJS from "exceljs";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve("query");
    // For export, you can decide whether to export a single record based on req.params.id
    // or a list of records. Here we'll use req.params.id as a filter.
    const { id } = req.params;
    console.log("Exporting specimen request for id:", id);

    // Query the specimen_request entity with the desired fields.
    const { data } = await query.graph({
      entity: "specimen_request",
      fields: [
        "email",
        "phone_number",
        "photo_id",
        "letter_head",
        "residence_address",
        "title_category",
        "name",
        "school_address",
        // Add any additional fields if required
      ],
      filters: { id: [id] } // Adjust this filter if you want to export multiple records.
    });

    // Create an Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Specimen Requests");

    // Define worksheet columns for each field
    worksheet.columns = [
      { header: "Email", key: "email", width: 30 },
      { header: "Phone Number", key: "phone_number", width: 20 },
      { header: "Photo ID", key: "photo_id", width: 20 },
      { header: "Letter Head", key: "letter_head", width: 20 },
      { header: "Residence Address", key: "residence_address", width: 40 },
      { header: "Title Category", key: "title_category", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "School Address", key: "school_address", width: 40 },
    ];

    // Add each record as a row into the worksheet
    data.forEach((specimen) => {
      worksheet.addRow({
        email: specimen.email,
        phone_number: specimen.phone_number,
        photo_id: specimen.photo_id,
        letter_head: specimen.letter_head,
        residence_address: specimen.residence_address,
        title_category: specimen.title_category,
        name: specimen.name,
        school_address: specimen.school_address,
      });
    });

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
    });

    // Generate the Excel file as a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers so the browser treats the output as an Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=specimen_requests_${Date.now()}.xlsx`
    );

    // Send the Excel file buffer as the response
    res.send(buffer);
  } catch (error: any) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to generate export file",
    });
  }
};

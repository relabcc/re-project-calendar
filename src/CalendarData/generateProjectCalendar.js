// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/create

const handleResponse = (response) => {
  console.log(response);
  return response.result;
};

export default (spreadsheets, data, projectName) => {
  const createNewSpreadSheet = (title) => spreadsheets.create({
    properties: { title },
  }).then(handleResponse);

  const setSpreadSheetValue = (spreadsheetId, values) => spreadsheets.values.update({
    spreadsheetId,
    range: 'A1:D5',
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  }).then(handleResponse);

  return createNewSpreadSheet(projectName).then((result) => {
    const spreadsheetId = result.spreadsheetId;
    return setSpreadSheetValue(spreadsheetId, [
      ["Item", "Cost", "Stocked", "Ship Date"],
      ["Wheel", "$20.50", "4", "3/1/2016"],
      ["Door", "$15", "2", "3/15/2016"],
      ["Engine", "$100", "1", "30/20/2016"],
      ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
    ]);
  });
}

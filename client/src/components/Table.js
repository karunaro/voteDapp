import React, { useState } from "react";
import "./Table.css";
import MaterialTable from "material-table";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";

export default function Table({ Destinations }) {
  // const [select, setSelect] = useState(false);
  // var icons;
  // select == false ? (icons = Clear) : (icons = Check);
  const mapedData =() =>{
    Destinations.map((i) => {
     return [{ SNo: i.id, name: i.name, vote: i.votes }]
    })
  }

  return (
    <div className="table_style">
      <MaterialTable
        columns={[
          { title: "ID.", field: "id" },
          { title: "Name", field: "name" },
          { title: "Votes", field: "votes" },
          // {
          //   cellStyle: {
          //     height: 50.5
          //   },
          // },
        ]}
        data={
          query =>
            new Promise((resolve, reject) => {
                // prepare your data and then call resolve like this:
                resolve({
                    data: Destinations,
                    totalCount: Destinations.length,
                });
            })
        

          // [
          // // mapedData()
          // { SNo: "1", name: "Baran", vote: "10" },
          // { SNo: "2", name: "Baran", vote: "10" },
          // { SNo: "3", name: "Baran", vote: "10" },
          // ]
        }
        title="Destination"
        options={{
          search: false,
          paging: false,
          sorting: false,
          // selection: true,
          rowStyle: { height: 39.5 },
        }}
        localization={{
          header: {
            actions: "Choose",
          },
        }}
        // onRowClick={(() =>  setSelect(!select))}
        // actions={[
        //   {
        //     icon: icons,
        //     //icons: {tableIcons},
        //     onClick: (event, rowData) => {
        //       // setSelect(!select);
        //     },
        //   },
        // ]}
      />
    </div>
  );
}

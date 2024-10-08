import { format } from "date-fns";
import "./components/datatable/datatable.scss"

export const userColumns = (handleImageClick, renderVerified) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "FullName",
    headerName: "User",
    width: 150,

  },
  {
    field: "Profile Photo",
    headerName: "Image",
    width: 130,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row["Profile Photo"]} alt="avatar" />
        </div>
      );
    },
  },

  {
    field: "Email",
    headerName: "Email",
    width: 130,
  },

  {
    field: "Date of Birth",
    headerName: "DOB",
    width: 130,
  },


  {
    field: "Gender",
    headerName: "Gender",
    width: 130,
  },

  {
    field: "Address",
    headerName: "Address",
    width: 200,
  },

  {
    field: "Phone",
    headerName: "Phone",
    width: 130,
  },


  {
    field: "State",
    headerName: "State",
    width: 100,
  },

  {
    field: "Vehicle Color",
    headerName: "Vehicle Color",
    width: 100,
  },

  {
    field: "Vehicle Make",
    headerName: "Vehicle Make",
    width: 100,
  },

  {
    field: "Vehicle Model",
    headerName: "Vehicle Model",
    width: 100,
  },

  {
    field: "Vehicle Number",
    headerName: "Vehicle Number",
    width: 100,
  },

  {
    field: "Vehicle Type",
    headerName: "Vehicle Type",
    width: 100,
  },

  {
    field: "Vehicle Year",
    headerName: "Vehicle Year",
    width: 100,
  },

  {
    field: 'Date Created',
    headerName: 'Date Created',
    width: 120,
    renderCell: (params) => {
      return format(new Date(params.value), "dd/MM/yyyy");
    },
  },

  {
    field: "Verified",
    headerName: "Verified",
    width: 100,
    renderCell: (params) => {
      const value = params.value;
      if (value === '0') {
        return <span>Unverified</span>;
      } else if (value === '1') {
        return <span>Verified</span>;
      } else {
        return null;
      }
    },
  },

  {
    field: "Documents", headerName: "Documents", width: 150,
    renderCell: (params) => {
        return (
            <div className="cellWithImg">
                {params.row.documents && params.row.documents.length > 0 ? (
                  params.row.documents.map((imageUrl, index) => (
                    <div key={index}>
                      <img
                        src={imageUrl}
                        alt={`Rider's Documents ${index + 1}`}
                        className="cellImg"
                        onClick={() => handleImageClick(imageUrl)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  ))
                ) : (
                  <p> No documents available.</p>
                )}
            </div>
        )
    }
},

];


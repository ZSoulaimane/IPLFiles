<div className ="container-table100">
  <div className="container">
    <div className="StyledDropZone">
    <StyledDropZone  onDrop={this.onDrop} />
    </div>
      <table className="container">
        <thead>
          <tr>
            <th><h1>Type</h1></th>
            <th><h1>File Name</h1></th>
            <th><h1>Date</h1></th>
            <th><h1>Amount</h1></th>
            <th><h1>Download</h1></th>
          </tr>
        </thead>
        <tbody>
        {solidityDrive !== [] ? solidityDrive.map((item, key)=>(
          <tr>
            <td>
              <FileIcon size={50}
                        extension={item[2]}
                        {...defaultStyles[item[2]]}
                        />
            </td>
            <td><strong><h5>{item[1]}</h5></strong></td>
            <td><strong><h5> <Moment format="YYYY/MM/DD" unix>{item[3]}</Moment></h5></strong></td>
            {/* the item[4] could be the amount of money for the first case or the hash file for the second case */}

            {/*  <td>{item[4]}</td> */}

            <td><strong><h5>{item[4]}</h5></strong></td>
            <td><a href={"https://ipfs.io/ipfs/"+item[0]}><img src={Download} className="logo"/></a></td>
          </tr>
          )) : null}
        </tbody>
      </table>
      </div>
      </div>
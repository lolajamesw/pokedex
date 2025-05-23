import React, { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([])
  useEffect(()=> {
    fetch('http://localhost:8081/group_members')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err))
  }, [])
  return (
    <div>
      <table>
        <thead>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Favourite Colour</th>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr key={index}>
              <td>{d.id}</td>
              <td>{d.first_name}</td>
              <td>{d.last_name}</td>
              <td>{d.favourite_colour}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
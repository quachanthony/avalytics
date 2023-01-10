import React, { Component } from 'react'
import Promise from 'promise'
import Image from 'react-bootstrap/Image'
import '../styles/Table.css'
import styled from 'styled-components'

import { useSortBy, useTable } from "react-table"

// BURGANDY #6F263D
// BLUE #236192
// SILVER #A2AAAD

//MySQL docker password = teHbyL0K3kYx&ekOwaRnif;@GIp

export default function Table({columns, data}){

   const Styles = styled.div`
      padding: 1rem;

      table {
         border-spacing: 0;
         border: 1px solid black;

         tr {
            :last-child {
            td {
               border-bottom: 0;
            }
            }
         }

         th,
         td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            border-right: 1px solid black;

            :last-child {
            border-right: 0;
            }
         }
      }
      `
   const {
      getTableProps, // table props from react-table
      getTableBodyProps, // table body props from react-table
      headerGroups, // headerGroups, if your table has groupings
      rows, // rows for the table based on the data passed
      prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
    } = useTable({
      columns: columns, data
    },
    useSortBy);

    return (
      <Styles>
         <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
               </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </Styles>
      
    );

}
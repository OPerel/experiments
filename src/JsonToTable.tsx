import React from 'react';
import './JsonToTable.css';

const data: any = {
  name: 'String',
  status: 'String',
  field: {
    _type: 'Number',
    _description: 'A number that describes something'
  },
  nested: {
    _type: 'Object',
    inside1: 'String',
    inside2: {
      _type: 'Object',
      _description: 'foo bar',
      ins: 'String',
      ins2: {
        _type: 'Object',
        ins22: 'Number'
      }
    },
    nested2: {
      _type: 'Object',
      inside11: 'URL',
      inside22: 'String',
      nested3: {
        _type: 'Object',
        inside111: {
          _type: 'Object',
          _description: 'la la la la la',
          nested33: {
            _type: 'Object',
            inn: {
              _type: 'String',
              _description: 'la di da di'
            },
            inn2: {
              _type: 'String',
              _description: 'la di da di'
            }
          }
        }
      },
      again2: {
        _type: 'Number',
        _description: 'something'
      }
    },
    again1: 'String'
  },
  outAgain: 'String'
}
// const data = {
//   "createdAt": "Date",
//   "type": {
//     "_type": "String",
//     "_description": "The Type of the event:\n- User Voted For Suggestion\n- User Added New Argument\n- User Added New Comment\n- User Added New Section Suggestion\n- User Added New Edit Section Suggestion\n- New Section Suggestion Was Accepted\n- New Edit Section Suggestion Was Accepted"
//   },
//   "subType": "String",
//   "itemId": {
//     "_ref": "Section|Argument|Comment",
//     "_description": "The id of the item that was added/changed/voted/accepted"
//   },
//   "creator": "User"
// }


// get a number representing the level of nesting to create empty columns
const nestedColumnsCounter = (data: any) => {
  const countObjects = (data: any) => {
    let maxCounter = 0;
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value._type && value._type === 'Object') {
        const childCounter = countObjects(value);
        if (childCounter + 1 > maxCounter){
          maxCounter = childCounter + 1;
        }
      }
    });
    return maxCounter;
  }
  return countObjects(data);
}

// create an array representing table headers
const createHeaders = (data: any): string[] => {
  const count = nestedColumnsCounter(data);
  return ['Field', ...new Array(count).fill('  ---  '), 'Type', 'Description'];
}

// create 2D array representing table rows (each nested array is a row)
const createRows = (data: any): string[][] => {
  let rows: string[][] = [];
  let iterationCounter = 0;
  const columns = nestedColumnsCounter(data);
  const jsonToRows = (data: any): void => {
    const keys = Object.keys(data);
    keys.forEach((key, idx) => {
      const value = data[key];
      if (typeof value === 'string') {
        if (key.startsWith('_')) {
          return;
        }
        let isFirstField = true;
        for (let i = 0; i < idx; i++) {
          isFirstField = isFirstField && keys[i].startsWith('_')
        }
        if (isFirstField && iterationCounter > 0) {
          rows[rows.length - 1].push(
            key,
            ...new Array(columns - iterationCounter).fill(''),
            value,
            ''
          );
          return;
        }
        rows.push([
          ...new Array(iterationCounter).fill(''),
          key,
          ...new Array(columns - iterationCounter).fill(''),
          value,
          ''
        ]);
        return;
      }
      if (value._ref || (value._type && value._type !== 'Object')) {
        let isFirstField = true;
        for (let i = 0; i < idx; i++) {
          isFirstField = isFirstField && keys[i].startsWith('_')
        }
        if (isFirstField && iterationCounter > 0) {
          const last = rows.length - 1;
          rows[last].push(
            key,
            ...new Array(columns - iterationCounter).fill(''),
            value._type || value._ref,
            value._description
          );
          return;
        }
        rows.push([
          ...new Array(iterationCounter).fill(''),
          key,
          ...new Array(columns - iterationCounter).fill(''),
          value._type || value._ref,
          value._description
        ]);
        return;
      }
      if (value._type && value._type === 'Object') {
        let isFirstField = true;
        for (let i = 0; i < idx; i++) {
          isFirstField = isFirstField && keys[i].startsWith('_')
        }
        if (isFirstField && iterationCounter > 0) {
          rows[rows.length - 1].push(key);
        } else {
          rows.push([
            ...new Array(iterationCounter).fill(''),
            key
          ])
        }
        iterationCounter++;
        jsonToRows(value);
      }
      if (iterationCounter > 0) {
        iterationCounter--;
      }
    })
  }
  jsonToRows(data);
  return rows;
}

const JsonToTable: React.FC = () => {

  return (
    <div className="json-to-table">
      <table>
        <thead>
          <tr>
            {createHeaders(data).map((h, i) => <th key={`${i}-${h}`}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {
            createRows(data).map((row, idx) => (
              <tr key={idx}>
                {
                  row.map((c, i) => <td key={`${i}-${c}`}>{c}</td>)
                }
              </tr>
            ))
          }
        </tbody>
      </table>
      {/*<pre style={{ textAlign: 'left', fontSize: '1.5em' }}>*/}
      {/*  {JSON.stringify(data, null, 2)}*/}
      {/*</pre>*/}
    </div>
  )
}

export default JsonToTable;
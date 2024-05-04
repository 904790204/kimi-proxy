import dayjs from 'dayjs'
import { Table, theme, Tag } from 'antd'
import classNames from 'classnames'
import ResizeObserver from 'rc-resize-observer'
import { useEffect, useRef, useState } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import { byteConvert, getContentType } from '@src/utils'
import Detail from '@src/components/requestDetails'
import styles from './index.less'
import { INTERCEPT_MOCK_BG, INTERCEPT_REWRITE_BG } from '@src/constant/intercept'

const VirtualTable = (props) => {
  const { columns, scroll, onDetail } = props
  const [tableWidth, setTableWidth] = useState(0)
  const { token } = theme.useToken()
  const widthColumnCount = columns.filter(({ width }) => !width).length
  const widthColumnTotal = columns.reduce((sum, current) => {
    return sum + (current.width || 0)
  }, 0)
  const mergedColumns = columns.map((column) => {
    if (column.width) {
      return column
    }
    return {
      ...column,
      width: Math.floor((tableWidth - widthColumnTotal) / widthColumnCount)
    }
  })
  const gridRef = useRef()
  const [connectObject] = useState(() => {
    const obj = {}
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft
        }
        return null
      },
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft
          })
        }
      }
    })
    return obj
  })
  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true
    })
  }
  useEffect(() => resetVirtualGrid, [tableWidth])

  const getRawBg = (rawData, rowIndex) => {
    const data = rawData[rowIndex]
    const { resType } = data
    if (resType === 'mock') {
      return INTERCEPT_MOCK_BG
    }
    if (resType === 'rewrite') {
      return INTERCEPT_REWRITE_BG
    }
    return rowIndex % 2 === 0 ? token.colorBgContainer : 'rgba(60, 90, 100, 0.04)'
  }

  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    ref.current = connectObject
    const totalHeight = rawData.length * 40
    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          const { width } = mergedColumns[index]
          return totalHeight > scroll?.y && index === mergedColumns.length - 1
            ? width - scrollbarSize - 1
            : width
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 40}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft
          })
        }}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div
            className={classNames('virtual-table-cell', {
              'virtual-table-cell-last': columnIndex === mergedColumns.length - 1
            })}
            onClick={() => onDetail(rawData[rowIndex], rowIndex)}
            style={{
              ...style,
              boxSizing: 'border-box',
              padding: token.padding,
              paddingTop: 0,
              paddingBottom: 0,
              textAlign: mergedColumns[columnIndex].align || 'left',
              lineHeight: '40px',
              borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
              background: getRawBg(rawData, rowIndex),
              overflow: 'hidden',
              height: '40px',
              textOverflow: 'ellipsis'
            }}
          >
            {mergedColumns[columnIndex].render
              ? mergedColumns[columnIndex].render(
                  rawData[rowIndex][mergedColumns[columnIndex].dataIndex],
                  rawData[rowIndex],
                  rowIndex
                )
              : rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
          </div>
        )}
      </Grid>
    )
  }
  return (
    <ResizeObserver
      onResize={(params) => {
        const { width } = params
        setTableWidth(width)
      }}
    >
      <Table
        {...props}
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList
        }}
      />
    </ResizeObserver>
  )
}

const Requests = ({ list = [], scrollY }) => {
  const [visible, setVisible] = useState(false)
  const [details, setDetails] = useState({})

  const handleDetail = (item, index) => {
    setVisible(true)
    setDetails(item)
  }

  const columns = [
    {
      title: 'index',
      dataIndex: 'index',
      render(val, row, index) {
        return index + 1
      },
      width: 60
    },
    {
      title: 'hostname',
      dataIndex: 'hostname'
    },
    {
      title: 'method',
      dataIndex: 'method',
      align: 'center',
      width: 100
    },
    {
      title: 'status',
      dataIndex: 'statusCode',
      align: 'center',
      width: 90,
      render: (val) => {
        if (!val)
          return (
            <Tag bordered={false} color="error">
              X
            </Tag>
          )
        if (val < 300) {
          return <Tag color="success">{val}</Tag>
        }
        if (val < 400) {
          return (
            <Tag bordered={false} color="warning">
              {val}
            </Tag>
          )
        }
        return (
          <Tag bordered={false} color="error">
            {val}
          </Tag>
        )
      }
    },
    {
      title: 'name',
      dataIndex: 'path',
      render: (val, row) => {
        const d = val.split('/')
        const result = d[d.length - 1] || d[d.length - 2] || val
        return result
      }
    },
    {
      title: 'type',
      dataIndex: 'type',
      width: 90,
      render: (val, row) => getContentType(row)
    },
    {
      title: 'start',
      dataIndex: 'startTime',
      align: 'center',
      width: 100,
      render: (val) => {
        return dayjs(val).format('HH:mm:ss')
      }
    },
    {
      title: 'duration',
      dataIndex: 'duration',
      width: 90,
      render: (val, row) => {
        const { endTime = 0, startTime = 0 } = row
        const millisecond = endTime - startTime
        return `${millisecond}ms`
      }
    },
    {
      title: 'size',
      dataIndex: 'size',
      width: 90,
      render: (val) => byteConvert(val)
    }
  ]
  return (
    <>
      <div className={styles.list}>
        <Detail details={details} visible={visible} onClose={() => setVisible(false)} />
        <VirtualTable
          columns={columns}
          dataSource={list}
          size="small"
          onDetail={handleDetail}
          scroll={{
            y: scrollY || window.innerHeight - 170
          }}
        />
      </div>
    </>
  )
}

export default Requests

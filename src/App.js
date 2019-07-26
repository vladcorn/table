import React, {Component, Fragment} from 'react';
import Loader from './Loader/Loader';
import Table from './Table/Table';
import _ from 'lodash';
import DetailRowView from './DetailRowView/DetailRowView';
import ModeSelector from './ModeSelector/ModeSelector';
import ReactPaginate from 'react-paginate';
import TableSearch from './TabeleSearch/TableSearch';

class App extends Component{
    state ={
        isModeSelected: false,
        isLoading: false,
        data:[],
        sortDir: 'asc',// desc
        sortField:'id',
        row:null,
        currentPage:0,
        search:'',
    };

  async fetchData(url){
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
       isLoading:false,
       data:_.orderBy(data,this.state.sortField,this.state.sortDir)
    });
  }

  onSort = sortField =>{
    const cloneData =  this.state.data.concat();
    const sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
    const data =_.orderBy(cloneData,sortField,sortDir);
    this.setState({
        data,
        sortDir,
        sortField
    });
  };
    onRowSelect = row =>{
        this.setState({row});
    };

    modeSelectorHandler = url =>{
        this.setState({
            isModeSelected:true,
            isLoading:true
        });
        this.fetchData(url);
    };

    pageChangeHandler = ({selected})=>{
        this.setState({currentPage:selected});
    };
    searchHandler = search =>{
        this.setState({
           search,
           currentPage:0
        });

    };
    getFilteredData(){
        const {data,search} = this.state;
        if(!search){
            return data;
        }

        return data.filter(item =>{
            return item['firstName'].toLocaleLowerCase().includes(search.toLocaleLowerCase())
            ||item['lastName'].toLocaleLowerCase().includes(search.toLocaleLowerCase())
            ||item['email'].toLocaleLowerCase().includes(search.toLocaleLowerCase())
            ||item['phone'].toLocaleLowerCase().includes(search.toLocaleLowerCase())

        });

    }

  render(){
      const pageSize = 50;
      if (!this.state.isModeSelected){
          return <div className={'container'}>
              <ModeSelector onSelect={this.modeSelectorHandler}/>
          </div>;
      }

      const filteredData = this.getFilteredData();
      const pageCount = Math.ceil(filteredData.length/pageSize);
      const displayData = _.chunk(filteredData,pageSize)[this.state.currentPage];

      return(
          <div className={"container"}>

              { this.state.isLoading
                  ? <Loader/>
                  :<Fragment>
                      <TableSearch onSearch={this.searchHandler}/>
                      <Table data={displayData}
                             onSort={this.onSort}
                             sortDir={this.state.sortDir}
                             sortField={this.state.sortField}
                             onRowSelect={this.onRowSelect}/>
                  </Fragment>

              }
              {
                  this.state.data.length > pageSize
                  ?  <ReactPaginate
                          previousLabel={'previous'}
                          nextLabel={'next'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          pageCount={pageCount}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={this.pageChangeHandler}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'}
                          pageClassName={'page-item'}
                          pageLinkClassName={'page-link'}
                          priviousClassName={'page-item'}
                          nextClassName={'page-item'}
                          previousLinkClassName={'page-link'}
                          nextLinkClassName={'page-link'}
                          forcePage={this.state.currentPage}
                      /> :null
              }

              {this.state.row
                  ? <DetailRowView person = {this.state.row}/>
                  : null
              }
          </div>
      );
  }

}

export default App;

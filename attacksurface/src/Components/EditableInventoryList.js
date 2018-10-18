import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import CpeClient from '../Scripts/CpeClient';

//###############################################################
//### AutoSuggest functions:

//https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
    
    return CpeClient.getAutoCompleteItems(escapedValue);
}

function getSuggestionValue(suggestion) {
    return suggestion.title;
}

function renderSuggestion(suggestion) {
    return ( 
        <div className="item">
            <div class="ui teal label">
                    {suggestion.title}
            </div>
        </div>
    );
}
//###############################################################


/**
 * Single editable CPE entry in the list.
 * CPE format is: cpe:cpeversion:type:vendor:product:version:update:edition
 *                :lang:sw_edition:target_sw:target_hw:other
 * 
 */
class CpeItem extends React.Component {
    
    
    handleDeleteClick = () => {
        this.props.onDeleteClick(this.props.cpe.id);
    }
    
    handleCpeClick = () => {
        this.props.onCpeClick(this.props.cpe.id);
    }
    
    render() {
        let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
        [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest] 
            = this.props.cpe.id.split(":");
        
            return (
                    <div className="item">
                        <div class={this.props.isActive ? "ui teal label" : "ui label"} > 
                            <i className="delete icon"
                                onClick={this.handleDeleteClick}></i>
                            <a className="detail"
                                onClick={this.handleCpeClick}>
                                {vendor+":"+product+":"+version+":"+update+":"+edition}
                            </a>
                        </div>
                    </div>
            )};
}


/**
 * List of all searched and saved CPEs. 
 * 
 */
export default class EditableInventoryList extends Component {
    constructor() {
        super();
        this.state = {
                searchValue: '',
                suggestions: [],
        }
    }
    
    onChange = (event, { newValue, method }) => {
        this.setState({
          searchValue: newValue
        });
        if (method === "click") {
            this.setState({
              searchValue: this.state.searchValue
            });
        }
      };
      
      onSuggestionsFetchRequested = ({ value }) => {
        if (value.length<3) {
            this.setState({
              suggestions: []
            });
        } else {
            this.setState({
              suggestions: getSuggestions(value)
            });
        }
      };

      onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };
      
      onSuggestionSelected = (event, selection) => {
          console.log("selected: " + selection.suggestion.id);
          this.props.onSelectCpeClick(selection.suggestion);
      }
    
    render() {
        // stateless component for cpe list:
        const cpeItems = this.props.selectedCpes.map((cpe) => (
            <CpeItem 
                onDeleteClick={this.props.onDeleteClick}
                onCpeClick={this.props.onCpeToggleClick}
                cpe={cpe}
                id={cpe.id}
                key={cpe.id}
                isActive={cpe.isActive}
            />
        ));
        
        // attributes for autosuggest input:
        const {searchValue, suggestions} = this.state;
        const inputProps = {
                placeholder: 'Windows, Redhat, Acrobat Reader...',
                value: searchValue,
                onChange: this.onChange
        };
        
        return (
                <div className="ui raised segment" 
                     style={{overflow: 'auto', "height":"30em"}}>
                    <Autosuggest 
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        onSuggestionSelected={this.onSuggestionSelected}
                        renderSuggestion={renderSuggestion}
                        focusInputOnSuggestionClick={false}
                        inputProps={inputProps} />
                <br/>
                <div className="field">
                     <button className="positive ui button" 
                         data-tooltip="Remember this asset list." 
                         onClick={this.props.onSaveClick} >
                          Save collection... 
                    </button>
                     <button className="ui negative toggle button" 
                          data-tooltip="Get emails on new critical vulnerabilities!" >
                          Notifcations are off
                    </button>
                </div>
              
                <div className="ui list">
                      {cpeItems}
                </div>
            </div>
        );
    }
}
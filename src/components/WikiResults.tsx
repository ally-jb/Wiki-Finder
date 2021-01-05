import React, { useState} from 'react'
import service from '../service/service'
import { Table, Input, InputGroup, InputGroupAddon, Button, Tooltip } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'

const WikiResults = () =>
{
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [toolTipOpen, setToolTipOpen] = useState(false)

    const getWikis = async(e) => {

        e.preventDefault();

        if (!query.trim()) 
        { 
            setResults([]) 
            return;
        }
        
        let url = "https://en.wikipedia.org/w/api.php";

        // using https://en.wikipedia.org/wiki/Template:In_title rather the srwhat
        const params = {
            action: "query",
            prop: "info",
            inprop: "url",
            generator: "search",
            gsrsearch: `intitle:${query}`,
            list: "search",
            srsearch: `intitle:${query}`,
            format: "json"
        };

        url += "?origin=*";
        Object.entries(params).forEach(([key, value]) => url += "&" + key + "=" + value);

        const res = await service.get(url);
        const result = await res.json();
        const querySearchResults = await formatResults(result);

        setResults(querySearchResults);

    }

    const formatResults = (results) => 
    {
        const formattedResults = results.query.search.map(item => {
            
            let formattedResult = {}

            Object.entries(item).forEach(([key,value]) => {
                    if (['title', 'snippet', 'wordcount', 'timestamp'].includes(key)) formattedResult[key] = value 
            })

            formattedResult['url'] =  results.query.pages[item.pageid] ? results.query.pages[item.pageid].fullurl : `https://en.wikipedia.org/wiki/${item.title}`

            return formattedResult
        });

        return formattedResults;
    }

    const handleChange = e => {
        setQuery(e.target.value)
    }

    const resultTable = (<Table bordered striped>
                            <thead>
                                <tr key="resultHeader">{['Title', 'Wordcount', 'Summary', 'Timestamp', 'Link'].map(header => <th key={`${header}`}>{header}</th>)}</tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? results.map((result, index) => <tr key={`result-row-${index}`}>
                                    <td key={`title-${index}`} style={{fontWeight: 'bold'}}>{result['title']}</td>
                                    <td key={`wordcount-${index}`}>{result['wordcount']}</td>
                                    <td key={`snippet-${index}`} style={{fontStyle: 'oblique'}} dangerouslySetInnerHTML={{__html: result['snippet']}}></td>
                                    <td key={`timestamp-${index}`}>{new Date(result['timestamp']).toLocaleDateString()}</td>
                                    <td key={`url-${index}`}><a href={`${result['url']}`} target="_blank" rel="noopener noreferrer">{`${result['url']}`}</a></td>
                                    </tr>) :
                                <tr><td colSpan={5} style={{textAlign: 'center'}}>No Results to Display</td></tr>}
                            </tbody>
                        </Table>)

    return (
        <>
        <div style={{textAlign: 'center'}}>
         <h1>Wiki Finder</h1>
        </div>
        <form onSubmit={getWikis} style={{paddingBottom: '40px', paddingTop: '30px'}}>
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <Button id='helper' outline onMouseEnter={() => setToolTipOpen(true)} onMouseLeave={() => setToolTipOpen(false)}>
                        <FontAwesomeIcon icon={faInfo} />
                    </Button>
                </InputGroupAddon>
                <Tooltip placement={'bottom'} isOpen={toolTipOpen} target='helper'>
                    Enter a search term to see the 10 most relevant Wikis based off title
                </Tooltip>
                <Input onChange={handleChange} value={query} id='queryInput'></Input>
                <InputGroupAddon addonType="append"><Button type="submit" >Submit</Button></InputGroupAddon>
            </InputGroup>
        </form>
        {resultTable}
        </>
    );

}

export default WikiResults
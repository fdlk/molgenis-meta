import meta from './meta'

interface RefEntityType {
    id: string
}

interface Attribute {
    name: string
    type: string
    refEntityType?: RefEntityType
}

interface EntityType {
    id:string
    attributes: Attribute[]
}

const isReferenceType = ({type: dataType}: Attribute) => 
    ['xref', 'mref', 'categorical', 'categoricalmref', 'onetomany'].includes(dataType)
const isFieldType = (attribute: Attribute) => !isReferenceType(attribute)
    
const fields = (attributes: Attribute[]): string => 
    attributes
        .filter(isFieldType)
        .map(({name, type}) =>`${name}: ${type}`).join(';')

const createClass = ({id, attributes}: EntityType): string => 
    `[${id}|${fields(attributes)}]\n${createLinks({id, attributes})}`

const multiplicity = (dataType: string) =>
    ['mref', 'categoricalmref', 'onetomany'].includes(dataType) ? '*' : ''

const arrowShaft = (dataType: string) => `${dataType==='onetomany'?'--':'-'}`

const createLink = (id: string, {name, type:dataType, refEntityType}: Attribute): string =>
    `[${id}]${arrowShaft(dataType)}>${name}${multiplicity(dataType)}[${refEntityType!.id}]`

const createLinks = ({id, attributes}: EntityType): string =>
    attributes
        .filter(it => it.refEntityType !== undefined)
        .map(it => createLink(id, it)).join('\n')

const yuml = meta.items.map(createClass).join('\n')        
console.log(`http://www.nomnoml.com.s3-website-eu-west-1.amazonaws.com/#view/${encodeURIComponent(yuml)}`)
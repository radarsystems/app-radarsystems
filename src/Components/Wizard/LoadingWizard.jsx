export default function LoadingWizard({ loading }) {
    return (<>
        {loading == true ? <div className="wizard-loading-circle"></div> : ''}
    </>)
}
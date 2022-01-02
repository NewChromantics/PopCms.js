//	todo:
//		- make this file update urls based on live server ENV settings

export const FileListUrl = '/List';
export const SyncStatusUrl = '/syncstatus';
export const GitLogUrl = '/git';
export const GitLastCommitUrl = '/gitlastcommit';
export const UploadUrl = '/Upload';

//	gr: setup a better sytem...
//		instance a "CMS" interface?
let HostPrefix = ''
export function SetHost(NewHostPrefix)
{
	HostPrefix = NewHostPrefix; 
}

export function GetAssetUrl(Filename)
{
	return `${HostPrefix}/Asset/${Filename}`;
}

function GetAssetUploadUrl(Filename)
{
	return `${HostPrefix}${UploadUrl}?Filename=${Filename}`;
}

export async function GetFileList()
{
	const Url = FileListUrl;
	const Response = await fetch(Url);
	const Files = await Response.json();
	if ( !Response.ok )
		throw Response.statusText;
	return Files;
}

export async function Upload(Filename,Contents)
{
	//	todo: need to work out text vs binary
	//	create a blob for uploading with form
	const ContentBytes = Contents;
	//const ContentsBytesBlob = new Blob([ContentBytes.buffer], {type: `data/${Format}`});
	const ContentsBytesBlob = new Blob([ContentBytes]);
	
	const Url = GetAssetUploadUrl(Filename);
	const formData = new FormData();
	formData.append("content", ContentsBytesBlob);
	formData.append("Filename", Filename);
	const FetchResult = await fetch( Url, { method: 'POST', body: formData });
	const ResponseBody = await FetchResult.text();
	
	if ( !FetchResult.ok )
		throw `Upload(${Filename}) error ${FetchResult.status}/${FetchResult.statusText}; ${ResponseBody}`;

	//	the response is a commit JSON
	const Commit = JSON.parse(ResponseBody);
	return Commit;
}


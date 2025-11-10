import { CopyIcon, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Team } from "../../types/pokemon-details";
import { ANALYTICS_API_URL } from "../../constants";


type Inputs = {
    isOpen: boolean,
    onClose: () => void,
    team?: Team,
}

export default function TeamExportModal({ isOpen, onClose, team }: Inputs) {
    const [teamText, setTeamText] = useState<string>("");

    useEffect(() => {
        if (!team) return;
        fetch(ANALYTICS_API_URL + '/teams/export/' + team.id)
            .then((res) => res.json())
            .then((data) => {setTeamText(data); console.log(data)})
            .catch((err) => console.error("Failed to fetch team summary:", err));
    }, [isOpen])

    const downloadTeam = () => {
        const blob = new Blob([teamText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "MyTeam";
        a.click();

        URL.revokeObjectURL(url);
    }

    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="font-bold text-xl">Export your team</h2>
                </div>
                <div className="modal-body">
                    <div className="relative w-full -mb-3">
                        <textarea 
                            className="w-full border border-gray-300 focus:border-gray-500 focus:outline-none p-2 text-base/5 rounded-lg  scrollbar-gutter-stable"
                            aria-multiline={true}
                            rows={20}
                            value={teamText}
                            onChange={(e) => setTeamText(e.target.value)} 
                        />
                        <button 
                            className={`absolute top-2 right-4 p-2 text-gray-400
                                hover:text-gray-500 hover:scale-105 active:scale-95`}
                            onClick={() => navigator.clipboard.writeText(teamText)}
                        >
                            <CopyIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <div className="modal-actions">
                        <button className="modal-button bg-indigo-500 hover:bg-indigo-600 text-white flex gap-2" onClick={downloadTeam}>
                            <Download className="h-4 w-4 m-auto"/>
                            Download
                        </button>
                        <button className="modal-button modal-button-cancel" onClick={onClose}>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
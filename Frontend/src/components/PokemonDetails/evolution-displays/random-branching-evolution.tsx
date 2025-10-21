import { Evolution } from "../../../types/pokemon-details.ts";
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom";

type Input = {
    evolutions: Evolution[],
    selectedName: string,
}

export default function RandomBranchingEvolutionContent({evolutions, selectedName}: Input) {
    return (
        // Random Branching Evolution Layout (Wurmple-style)
        <div className="space-y-8">
            {/* Base Pokemon */}
            <div className="flex justify-center">
            <div className="text-center">
                <div
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    evolutions[0].base.name === selectedName
                    ? "border-green-500 bg-green-50"
                    : "border-border hover:border-muted-foreground"
                }`}
                >
                <img
                    src={`https://www.serebii.net/pokemon/art/${evolutions[0].base.imgID}.png`}
                    alt={evolutions[0].base.name}
                    width={80}
                    height={80}
                    className="mx-auto"
                />
                </div>
                <h3 className="font-semibold mt-2 text-foreground">{evolutions[0].base.name}</h3>
            </div>
            </div>

            {/* Random Evolution Branches */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {evolutions.map((branch: any, branchIndex: number) => (
                <div key={branchIndex} className="space-y-4">
                {/* Branch Header */}
                <div className="text-center">
                    <span className="badge bg-yellow-100 text-yellow-800 border border-yellow-300">
                    Path {branchIndex + 1}
                    </span>
                </div>

                {/* Stage 1 Evolution */}
                <div className="text-center">
                    <Link
                    to={`/pokedex/${branch.stage1.pID}`}
                    key={branch.stage1.pID}
                    style={{ textDecoration:"none", color: "inherit" }}>
                    <div
                        className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 pokemon-card-hover ${
                        branch.stage1.name === selectedName
                            ? "border-green-500 bg-green-50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                    >
                        <img
                        src={`https://www.serebii.net/pokemon/art/${branch.stage1.imgID}.png`}
                        alt={branch.stage1.name}
                        width={70}
                        height={70}
                        className="mx-auto"
                        />
                    </div>
                    <h4 className="font-semibold mt-2 text-foreground">{branch.stage1.name}</h4>
                    </Link>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                </div>

                {/* Stage 2 Evolution */}
                <div className="text-center">
                    <Link
                    to={`/pokedex/${branch.stage2.pID}`}
                    key={branch.stage2.pID}
                    style={{ textDecoration:"none", color: "inherit" }}>
                    <div
                        className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 pokemon-card-hover ${
                        branch.stage2.name === selectedName
                            ? "border-green-500 bg-green-50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                    >
                        <img
                        src={`https://www.serebii.net/pokemon/art/${branch.stage2.imgID}.png`}
                        alt={branch.stage2.name}
                        width={70}
                        height={70}
                        className="mx-auto"
                        />
                    </div>
                    <h4 className="font-semibold mt-2 text-foreground">{branch.stage2.name}</h4>
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>
    )
}

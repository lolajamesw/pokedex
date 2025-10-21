import { EffectType } from "../types/pokemon-details";


type Inputs = {
    teamSummary: EffectType[]
}

export default function TypeSummary({teamSummary}: Inputs) {
    
    const getEffectivenessColor = (value: number) => {
      if (value >= 1.5) return "text-green-600 bg-green-50"
      if (value >= 1.2) return "text-green-500 bg-green-50"
      if (value <= 0.5) return "text-red-600 bg-red-50"
      if (value <= 0.8) return "text-red-500 bg-red-50"
      return "text-gray-600 bg-gray-50"
    }
    
    const getEffectivenessLabel = (value: number) => {
      if (value >= 1.8) return "Excellent"
      if (value >= 1.2) return "Good"
      if (value <= 0.5) return "Poor"
      if (value <= 0.8) return "Weak"
      return "Average"
    }
    
    const getStatClass = (stat: number) => {
      if (stat >= 2) return "stat-excellent"
      if (stat >= 0.8) return "stat-high"
      if (stat >= 0.5) return "stat-medium"
      return "stat-low"
    }

    return (
        <div className="card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <div className="p-6 pt-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Offensive Analysis */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Offensive Coverage</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    How well your team attacks each type (higher = better)
                  </p>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {teamSummary.map((type) => {
                    const effectiveness = type.atkAvg;
                    const percentage = Math.max(Math.min(((Math.log2(Math.max(effectiveness, 0.001)) / 5) + 0.5) * 100, 100), 0) // Scale 0-2 to 0-100%
                    return (
                      <div key={type.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span key={type.type} className={`badge badge-type type-${type.type.toLowerCase()}  text-white`}>
                                {type.type}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getEffectivenessColor(effectiveness)}`}>
                              {getEffectivenessLabel(effectiveness)}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-medium">{effectiveness.toFixed(1)}×</span>
                        </div>
                        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`stat-bar h-full rounded-full ${getStatClass(effectiveness)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                
              </div>

              {/* Defensive Analysis */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Defensive Resistances</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    How well your team defends against each type (higher = better)
                  </p>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {teamSummary.map((type) => {
                    const effectiveness = type.defAvg
                    const percentage = Math.max(Math.min(((Math.log2(Math.max(effectiveness, 0.001)) / 5) + 0.5) * 100, 100), 0) // Scale 0-2 to 0-100%
                    const getDefensiveLabel = (value: number) => {
                      if (value <= 0.5) return "Vulnerable"
                      if (value <= 0.8) return "Weak"
                      if (value >= 1.8) return "Excellent"
                      if (value >= 1.2) return "Good"
                      return "Average"
                    }

                    return (
                      <div key={type.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span key={type.type} className={`badge badge-type type-${type.type.toLowerCase()} text-white`}>
                                {type.type}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getEffectivenessColor(effectiveness)}`}>
                              {getDefensiveLabel(effectiveness)}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-medium">{effectiveness.toFixed(1)}×</span>
                        </div>
                        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`stat-bar h-full rounded-full ${getStatClass(effectiveness)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
          </div>
          {/* Summary */}
          <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm text-foreground">Analysis Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <strong>Offensive Strengths:</strong> Types your team attacks effectively
                  <br />
                  <strong>Coverage Gaps:</strong> Types your team struggles to attack
                </div>
                <div>
                  <strong>Defensive Strengths:</strong> Types your team resists well
                  <br />
                  <strong>Vulnerabilities:</strong> Types that threaten your team
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}
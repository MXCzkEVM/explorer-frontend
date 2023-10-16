




export const replaceRules = [
    {target: /Wannsee/g, replacement: "zkEVM"},
    {target: /WNS/g, replacement: "ZKEVM"},
    {target: /Uniswap/g, replacement: "Swap"},
    {target: /ETH/g, replacement: "MXC"},
]

export const replaceText = (originalText:string, rules:any)=> {
    let result = originalText;
    for (let rule of rules) {
      result = result.replace(rule.target, rule.replacement);
    }
    return result;
}
  
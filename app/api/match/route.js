"use strict";(()=>{var e={};e.id=4508,e.ids=[4508],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},34455:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>g,originalPathname:()=>_,patchFetch:()=>f,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>d,staticGenerationAsyncStorage:()=>m,staticGenerationBailout:()=>y});var a={};r.r(a),r.d(a,{POST:()=>h,dynamic:()=>u});var n=r(95419),s=r(69108),i=r(99678),o=r(78070),c=r(8234);let u="force-dynamic";async function h(e){try{let t;let{query:r}=await e.json();if(!r||r.trim().length<5)return o.Z.json({error:"Please describe what you want to automate"},{status:400});let a=(0,c.eI)(),{data:n,error:s}=await a.from("agents").select("name, slug, short_description, primary_category, capability_tags, industry_tags, pricing_model").eq("is_active",!0).limit(250);if(s||!n)return o.Z.json({error:"Failed to fetch agents"},{status:500});let i=`You are an AI agent matching expert for The AI Agent Index. A business owner has described what they want to automate. Find the best matching AI agents from the directory.

User's request: "${r}"

Available agents:
${JSON.stringify(n)}

Return ONLY a valid JSON array with no markdown or explanation. Top 3-5 best matches in this format:
[
  {
    "slug": "agent-slug",
    "name": "Agent Name",
    "reason": "2-3 sentences explaining why this agent fits their specific use case",
    "fit_score": 95,
    "pricing_model": "freemium"
  }
]

Rules:
- Only return agents that genuinely match the need
- fit_score is 0-100, be honest
- reason must be specific to their exact use case, never generic
- Order by fit_score descending
- If fewer than 3 genuinely match, return fewer`,u=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1e3,messages:[{role:"user",content:i}]})}),h=await u.json(),l=h.content?.[0]?.text||"[]";try{t=JSON.parse(l)}catch{let e=l.match(/\[[\s\S]*\]/);t=e?JSON.parse(e[0]):[]}return o.Z.json({matches:t})}catch(e){return console.error("Match API error:",e),o.Z.json({error:"Something went wrong"},{status:500})}}let l=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/match/route",pathname:"/api/match",filename:"route",bundlePath:"app/api/match/route"},resolvedPagePath:"/Users/Heather/Documents/GitHub/the-ai-agent-index/app/api/match/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:m,serverHooks:d,headerHooks:g,staticGenerationBailout:y}=l,_="/api/match/route";function f(){return(0,i.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:m})}},8234:(e,t,r)=>{r.d(t,{OQ:()=>i,_o:()=>u,eI:()=>o,mq:()=>c});var a=r(23950);let n="https://eptyhkttiypoplntkdmr.supabase.co",s="sb_publishable_cwvYAlCZlXg3bdGljxGQSA_Y8TBrQKD";n&&s||console.warn("Supabase env vars NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.");let i=(0,a.eI)(n??"",s??"");function o(){return(0,a.eI)(n??"",s??"")}function c(){let e=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!e)throw Error("SUPABASE_SERVICE_ROLE_KEY is not set");return(0,a.eI)(n??"",e)}async function u(e,t){if(!n||!s)return[];let{data:r,error:a}=await i.from("agents").select("*").eq("is_active",!0).eq("primary_category",e).contains("industry_tags",[t]);return a?(console.error("Error fetching agents by category and industry",a),[]):r??[]}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1638,3950,6206],()=>r(34455));module.exports=a})();
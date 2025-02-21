import { getIndustries } from "@/lib/actions/industry.actions";

export default async function Industries() {
    const industries = await getIndustries(1);
    console.log(industries);
    return (
    <div className="space-y-16">
    {industries.map((industry, index) => (
      <div 
        key={industry.id}
        className="bg-white rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative h-64 md:h-full">
          
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-8">
               
              </div>
              <div>
                <h3 className="text-sm text-gray-500">{industry.name}</h3>
                <h2 className="text-xl font-semibold text-gray-900">{industry.content}</h2>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {industry.slug}
            </h2>

            <p className="text-gray-600 mb-6">
              {industry.content}
            </p>


          </div>
        </div>
      </div>
    ))}
  </div>
    );
    // return <div>{industries.map((industry) => 
    //     <div key={industry.id}>
    //         <h1>{industry.name}</h1>
    //         <p>{industry.slug}</p>
    //         <p>{industry.content}</p>
    //     </div>
    // )}</div>;
}

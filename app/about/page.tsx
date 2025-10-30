import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 導航欄 */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">ADHD 知多少</div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600">首頁</Link>
              <Link href="/about" className="text-blue-600 font-medium">關於ADHD</Link>
              <Link href="/symptoms" className="text-gray-600 hover:text-blue-600">症狀特徵</Link>
              <Link href="/resources" className="text-gray-600 hover:text-blue-600">資源分享</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">聯絡我們</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">關於注意力不足過動症 (ADHD)</h1>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">什麼是ADHD？</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              注意力不足過動症（Attention-Deficit/Hyperactivity Disorder，簡稱ADHD）是一種神經發展障礙，主要特徵包括持續的注意力不集中、過動和衝動行為。這些症狀會影響個人的學業、工作和人際關係。
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              ADHD不是教養不當、懶惰或缺乏紀律的結果，而是大腦功能運作方式的差異。研究顯示，ADHD與大腦中某些神經傳導物質（如多巴胺和去甲腎上腺素）的調節異常有關。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold mb-4 text-blue-700">ADHD的類型</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="font-semibold">1. 注意力不集中型</h4>
                  <p className="text-gray-600 text-sm">主要表現為注意力不集中，但不過動或衝動。</p>
                </li>
                <li>
                  <h4 className="font-semibold">2. 過動/衝動型</h4>
                  <p className="text-gray-600 text-sm">主要表現為過動和衝動行為，注意力問題較不明顯。</p>
                </li>
                <li>
                  <h4 className="font-semibold">3. 混合型</h4>
                  <p className="text-gray-600 text-sm">同時表現出注意力不集中、過動和衝動的症狀。</p>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold mb-4 text-blue-700">ADHD的常見迷思</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✘</span>
                  <span className="text-gray-600">ADHD只是孩子才會有的問題</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✘</span>
                  <span className="text-gray-600">ADHD是因為父母教養不當造成的</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✘</span>
                  <span className="text-gray-600">ADHD患者只是懶惰或缺乏紀律</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✘</span>
                  <span className="text-gray-600">ADHD只是一種現代社會的發明</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">ADHD的正面特質</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2">創造力</h3>
                <p className="text-gray-600 text-sm">ADHD患者通常思維跳躍，能夠提出獨特的解決方案。</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2">熱情</h3>
                <p className="text-gray-600 text-sm">對感興趣的事物表現出極大的熱情和專注力。</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2">適應力</h3>
                <p className="text-gray-600 text-sm">能夠快速適應變化和突發情況。</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">治療與支持</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              ADHD的治療通常是多方面的，可能包括藥物治療、行為治療、心理治療和教育支持。早期診斷和適當的干預可以顯著改善ADHD患者的預後。
            </p>
            <p className="text-gray-700 leading-relaxed">
              如果您懷疑自己或您的孩子可能有ADHD，建議尋求專業醫療人員的評估和診斷。記住，尋求幫助是邁向更好生活的第一步。
            </p>
            <div className="mt-8">
              <Link 
                href="/contact" 
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 inline-block"
              >
                聯絡專業人員
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 頁尾 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400">
            <p>© {new Date().getFullYear()} ADHD 知多少. 版權所有.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

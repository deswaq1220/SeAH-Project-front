import { XCircleIcon } from '@heroicons/react/20/solid'

export default function LoginFailed() {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">로그인에 실패하였습니다</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              <li>아이디 또는 비밀번호를 확인해주세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
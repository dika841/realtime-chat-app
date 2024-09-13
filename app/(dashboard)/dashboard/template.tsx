import { Sidebar } from "@/components/container/sidebar";
import { FC, PropsWithChildren, ReactElement } from "react";

const Template:FC<Readonly<PropsWithChildren>> = ({children}):ReactElement => {
    return (
        <section className="w-full max-w-[1440px] bg-slate-50 min-h-screen">
            <Sidebar/>
            {children}
        </section>
    )
}

export default Template;